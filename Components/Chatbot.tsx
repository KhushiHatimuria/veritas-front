import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Animated,
    Easing,
    ActivityIndicator,
} from "react-native";

// --- NEW ASYNC STORAGE IMPORT (Required for Persistence) ---
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// --- FIREBASE IMPORTS ---
// Importing everything from auth as FirebaseAuth to resolve deep TypeScript issues
import * as FirebaseAuth from 'firebase/auth'; 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, Firestore } from 'firebase/firestore';


// --- CONFIGURATION ---
// Explicitly declare types for environment-injected variables (for Canvas compatibility)
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';
const API_KEY = ""; 

// This uses environment variables exposed via EXPO_PUBLIC_* in your local .env file
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// System Instruction for the AI Persona (App Guide Knowledge)
const SYSTEM_PROMPT = "Act as Verta Chatbot, a friendly, AI-powered support agent and app guide for the Veritas fact-checking and news platform. Your primary goals are to assist users with questions about the Veritas app features and provide grounded, concise, and helpful general information when requested. Keep your responses encouraging and professional. Always use the information from your search results to ground your answers. \n\nHere is key information about the Veritas app features and navigation:\n\n1.  **Compose/Verification Screen:** Users access this screen to submit content for verification. They can find the entry point on the 'home' screen by clicking the 'What do you want to verify today?' search bar, or the small compose icon next to it. Once on the 'Compose' screen, they can type their query, and add photos, audio, or links, before hitting the 'Verify' button.\n2.  **My Account/Profile Options:** The user's account options (which include History, Saved, Archives, Rewards, About, and Logout) are accessed via the main navigation menu. They need to click on the **profile icon (a person's bust)** located in the top right corner of the 'home' screen.";


// --- TYPE DEFINITIONS ---
type ChatMessage = {
    id: string;
    role: 'user' | 'bot' | 'system';
    text: string;
    timestamp: Date | Timestamp;
    sources?: { uri: string; title: string }[];
};


// --- UTILITY FUNCTIONS (Gemini API Call) ---

async function fetchGeminiResponse(userText: string): Promise<{text: string, sources: { uri: string; title: string }[]}> {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    const maxRetries = 5;
    const chatHistory = [{ role: "user", parts: [{ text: userText }] }];

    const payload = {
        contents: chatHistory,
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                const text = candidate.content.parts[0].text;
                
                let sources: { uri: string; title: string }[] = [];
                const groundingMetadata = candidate.groundingMetadata;
                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map((attribution: any) => ({
                            uri: attribution.web?.uri as string,
                            title: attribution.web?.title as string,
                        }))
                        .filter((source: any) => source.uri && source.title);
                }

                return { text, sources };
            } else {
                return { text: "I apologize, Verta is currently unable to generate a response.", sources: [] };
            }

        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) {
                throw new Error("Failed to connect to the AI service after multiple retries.");
            }
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return { text: "Verta could not connect to the service. Please try again.", sources: [] };
}


// --- MAIN REACT NATIVE COMPONENT ---

export default function Chatbot() {
    // Original UI State
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const listRef = useRef<FlatList<ChatMessage>>(null);

    // Chat / AI State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    // Firebase State
    const [db, setDb] = useState<Firestore | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 🎬 Animation setup for chat box (from original code)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // --- FIREBASE INITIALIZATION & AUTH (Updated for AsyncStorage) ---
    useEffect(() => {
        // Explicitly check for config values
        const configKeys = Object.keys(firebaseConfig).filter(k => (firebaseConfig as any)[k]);
        const isConfigValid = configKeys.length === 6; // All 6 required keys are present

        if (!isConfigValid) {
            console.error("FIREBASE CONFIG ERROR: One or more EXPO_PUBLIC_FIREBASE_* variables are missing or empty.");
            // Log the missing keys for easy debugging
            Object.entries(firebaseConfig).forEach(([key, value]) => {
                if (!value) console.error(`MISSING CONFIG KEY: ${key}`);
            });
            
            setIsAuthReady(true); // Allow user to type, skipping persistence
            // Use simple Date object
            setMessages([
                { id: "0", role: "bot", text: "⚠️ Auth Failed. Please check your .env file for missing Firebase config values.", timestamp: new Date() },
            ]);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            let currentAuth: FirebaseAuth.Auth;

            try {
                // Initialize Auth with AsyncStorage for persistence
                currentAuth = FirebaseAuth.initializeAuth(app, {
                    // FIX: Access persistence via the imported alias (FirebaseAuth)
                    // This is the correct functional fix and removes the invalid static import attempt.
                    persistence: FirebaseAuth.getReactNativePersistence(ReactNativeAsyncStorage) as any,
                });
            } catch (e) {
                console.error("FATAL: initializeAuth failed (AsyncStorage issue?). Fallback to standard Auth.", e);
                // If persistence setup fails, fall back to simple memory persistence
                currentAuth = FirebaseAuth.getAuth(app);
            }
            
            const currentDb = getFirestore(app);
            setDb(currentDb);
            
            const unsubscribe = FirebaseAuth.onAuthStateChanged(currentAuth, async (user) => {
                let currentUserId: string | null = null;
                if (user) {
                    currentUserId = user.uid;
                    console.log("Firebase Auth Success. User ID:", currentUserId);
                } else {
                    // Sign in anonymously if no user is found
                    if (initialAuthToken) {
                         await FirebaseAuth.signInWithCustomToken(currentAuth, initialAuthToken);
                    } else {
                        await FirebaseAuth.signInAnonymously(currentAuth);
                    }
                    currentUserId = currentAuth.currentUser?.uid || 'default-anon-user';
                    console.log("Signed in anonymously. User ID:", currentUserId);
                }
                setUserId(currentUserId);
                setIsAuthReady(true); // Authentication attempt finished, enable input
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase App Initialization Failed:", e);
            setIsAuthReady(true); // Allow typing, as Firebase failed early
        }
    }, []);

    // --- FIREBASE DATA SUBSCRIPTION (LOAD HISTORY) ---
    useEffect(() => {
        if (!isAuthReady || !db || !userId) return;

        // Path: /artifacts/{appId}/users/{userId}/chat_messages
        const chatPath = `/artifacts/${appId}/users/${userId}/chat_messages`;
        const q = query(collection(db, chatPath), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const history: ChatMessage[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp instanceof Timestamp ? doc.data().timestamp.toDate() : doc.data().timestamp || new Date(),
            })) as ChatMessage[];

            if (history.length === 0) {
                history.push({ 
                    id: "0", 
                    role: "bot", 
                    text: "👋 Hi! I'm Verta, the AI support for Veritas. Your chat history is saved! How can I assist you today?", 
                    timestamp: new Date()
                });
            }
            setMessages(history);
        }, (error) => {
            console.error("Error listening to chat messages:", error);
            if (messages.length === 0) {
                setMessages([
                    { id: "0", role: "bot", text: "👋 Hi! I'm Verta. I couldn't load your history, but I'm ready to chat! How can I assist you today?", timestamp: new Date() },
                ]);
            }
        });

        return () => unsubscribe();
    }, [isAuthReady, db, userId]);


    // --- UI/ANIMATION EFFECTS ---
    useEffect(() => {
        if (open) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
        }
    }, [open]);

    // Scroll to end (from original code)
    useEffect(() => {
        listRef.current?.scrollToEnd({ animated: true });
    }, [messages, open]);


    // --- MESSAGE SENDING LOGIC ---
    const send = useCallback(async () => {
        const text = input.trim();
        if (!text || loading || !isAuthReady || !userId) return;

        setLoading(true);
        setInput("");

        // Manually simulate local user message addition for instant feedback
        const tempUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text, timestamp: new Date() };
        
        // Temporarily add user message and trigger scroll
        setMessages(prev => [...prev, tempUserMsg]);
        listRef.current?.scrollToEnd({ animated: true });
        
        // 1. Prepare and save user message (Firestore handles actual state update later)
        const userMsg = { role: 'user', text: text, timestamp: serverTimestamp() };
        try {
            if (db) {
                await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/chat_messages`), userMsg);
            }
        } catch (error) {
            console.error("Error saving user message to Firestore:", error);
        }

        // 2. Get AI response
        let aiResponse;
        try {
            aiResponse = await fetchGeminiResponse(text);
        } catch (error) {
            console.error("Gemini API call failed:", error);
            aiResponse = { text: "I'm sorry, I'm having trouble connecting to the AI service right now.", sources: [] };
        }

        // 3. Prepare and save bot message
        const botMsg = {
            role: 'bot',
            text: aiResponse.text,
            timestamp: serverTimestamp(),
            sources: aiResponse.sources || [],
        };
        
        try {
            if (db) {
                await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/chat_messages`), botMsg);
            } else {
                // If persistence is disabled, manually add bot message
                // FIX FOR REDLINE: Define the object structure explicitly to satisfy TS.
                const tempBotMsg: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'bot',
                    text: botMsg.text,
                    timestamp: new Date(),
                    sources: botMsg.sources,
                };
                setMessages(prev => [...prev, tempBotMsg]);
                listRef.current?.scrollToEnd({ animated: true });
            }
        } catch (error) {
            console.error("Error saving bot message to Firestore:", error);
        }
        
        setLoading(false);

    }, [input, loading, isAuthReady, db, userId, appId]);
    
    // --- Message Renderer Component ---
    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.role === 'user';
        
        return (
            <View
                style={[
                    styles.msg,
                    isUser ? styles.user : styles.bot,
                ]}
            >
                {/* Message text, replacing markdown newlines with RN newlines */}
                <Text style={isUser ? styles.userText : styles.botText}>
                    {item.text.replace(/\\n/g, '\n')}
                </Text>
                
                {/* Citations/Sources for Bot (Rendered using Text, as RN doesn't support <a> tags easily) */}
                {item.sources && item.sources.length > 0 && (
                    <View style={styles.citationContainer}>
                        <Text style={styles.citationHeader}>Sources:</Text>
                        {item.sources.map((source, index) => (
                            // NOTE: Cannot display clickable links in standard RN/Expo text; showing title only.
                            <Text key={index} style={styles.citationText}>
                                {index + 1}. {source.title}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        // Using React Native components (View, FlatList, etc.)
        <>
            {open && (
                <KeyboardAvoidingView
                    behavior={Platform.select({ ios: "padding", android: undefined })}
                    style={styles.wrapper}
                >
                    <Animated.View
                        style={[
                            styles.box,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.header}>🤖 Verta Chatbot</Text>

                        <FlatList
                            ref={listRef}
                            data={messages}
                            keyExtractor={(m) => m.id}
                            contentContainerStyle={styles.list}
                            renderItem={renderMessage}
                        />

                        {/* Loading Indicator for AI response */}
                        {loading && (
                            <View style={styles.loadingIndicatorContainer}>
                                <ActivityIndicator size="small" color="#a64dff" />
                                <Text style={styles.loadingText}>Verta is thinking...</Text>
                            </View>
                        )}

                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={input}
                                onChangeText={setInput}
                                placeholder={loading ? "Waiting for response..." : "Type a message…"}
                                placeholderTextColor="#777"
                                returnKeyType="send"
                                onSubmitEditing={send}
                                editable={!loading && isAuthReady}
                            />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.send,
                                    (loading || !isAuthReady) && styles.sendDisabled,
                                    pressed && !loading && isAuthReady && { transform: [{ scale: 0.95 }] },
                                ]}
                                onPress={send}
                                disabled={loading || !isAuthReady}
                            >
                                <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            )}

            <Pressable
                onPress={() => setOpen(!open)}
                style={({ pressed }) => [
                    styles.fab,
                    pressed && { transform: [{ scale: 0.9 }] },
                ]}
            >
                <Text style={styles.fabIcon}>{open ? '✖️' : '💬'}</Text>
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 90,
        right: 20,
        zIndex: 999,
        alignSelf: 'flex-end',
    },
    box: {
        width: 320,
        height: 420,
        backgroundColor: "#0d0d0d",
        borderRadius: 20,
        padding: 12,
        shadowColor: "#a64dff",
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    header: {
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
        color: "#a64dff",
        fontSize: 16,
        letterSpacing: 1,
    },
    list: {
        flexGrow: 1,
        paddingVertical: 8,
    },
    msg: {
        maxWidth: "80%",
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    user: {
        alignSelf: "flex-end",
        backgroundColor: "#6b00b6",
        shadowColor: "#a64dff",
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    bot: {
        alignSelf: "flex-start",
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: '#3a0066',
    },
    userText: {
        color: "#fff",
    },
    botText: {
        color: "#cfcfcf",
    },
    citationContainer: {
        marginTop: 8,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#3a0066',
    },
    citationHeader: {
        fontSize: 10,
        color: '#a64dff',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    citationText: {
        fontSize: 10,
        color: '#888',
        fontStyle: 'italic',
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        marginTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#3a0066",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: "#fff",
        backgroundColor: "#1a1a1a",
    },
    send: {
        backgroundColor: "#a64dff",
        paddingHorizontal: 14,
        height: 40,
        justifyContent: "center",
        borderRadius: 10,
        shadowColor: "#a64dff",
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    sendDisabled: {
        backgroundColor: "#6b00b6",
        opacity: 0.5,
        shadowOpacity: 0.1,
    },
    sendText: {
        color: "#fff",
        fontWeight: "600",
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 20,
        backgroundColor: "#a64dff",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#a64dff",
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 1000,
    },
    fabIcon: {
        fontSize: 22,
        color: "#fff",
    },
    loadingIndicatorContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#3a0066',
        borderRadius: 12,
        maxWidth: '80%',
        padding: 10,
        marginVertical: 4,
    },
    loadingText: {
        color: "#cfcfcf",
        marginLeft: 8,
    }
});