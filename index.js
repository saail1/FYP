import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert, // Import Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  User,
  ArrowLeft,
  MessageSquare,
  History,
  Settings,
  Mic,
  ArrowRight,
  MonitorStop,
  AudioLines,
  Voicemail,
  Send,
  Camera,
  Home,
  LogIn,
  LogOut,
  RefreshCcw,
} from 'lucide-react-native';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// --- FIREBASE CONFIGURATION ---
// TODO: Replace with your actual config from Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyAbWh3AuX4cxMx3O7b-631SlYLh9hUs0cM",
  authDomain: "sivoapp1.firebaseapp.com",
  projectId: "sivoapp1",
  storageBucket: "sivoapp1.appspot.com",
  messagingSenderId: "636161238154",
  appId: "1:636161238154:web:53b316739da46e3c833973"
};

// Initialize Firebase
let auth;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.log("Firebase initialization error:", error);
}

const SIVO_COLORS = {
  background: '#4A2F76',
  bgLight: '#9B0F23',
  topBarStart: '#4A2F76',
  topBarEnd: '#D15A1F',
  bottomBarStart: '#9B0F23',
  bottomBarEnd: '#B73E55',
  mainButtonStart: '#9B0F23',
  mainButtonEnd: '#D15A1F',
  coolButtonStart: '#0288D1',
  coolButtonEnd: '#03A9F4',
  text: '#F5F5F5',
  textLight: '#9CA3AF',
  card: 'rgba(0, 0, 0, 0.2)',
  border: 'rgba(255, 255, 255, 0.1)',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

const authBackgroundImage = {
  uri: 'https://images.unsplash.com/photo-1600984505316-c010c3b83f53?auto=format&fit=crop&w=1080&q=80',
};

function AnimatedActionButton({ title, IconComponent, onPress, style, gradientColors, loading }) {
  const anim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  const defaultViewOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const defaultViewTranslateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const activeViewOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const activeViewTranslateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  const Content = (
    <>
      <Animated.View
        style={[
          styles.animatedButtonContent,
          { opacity: defaultViewOpacity, transform: [{ translateY: defaultViewTranslateY }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={styles.loginButtonText}>{title}</Text>
            <IconComponent size={20} color="white" style={{ marginLeft: 8 }} />
          </>
        )}
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedButtonContent,
          {
            position: 'absolute',
            opacity: activeViewOpacity,
            transform: [{ translateY: activeViewTranslateY }],
          },
        ]}
      >
        <IconComponent size={24} color="white" />
      </Animated.View>
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={loading}
      style={[styles.animatedButton, style, { padding: 0, overflow: 'hidden' }]}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', padding: 16 }}
        >
          {Content}
        </LinearGradient>
      ) : (
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          {Content}
        </View>
      )}
    </TouchableOpacity>
  );
}

function AnimatedWaveform() {
  const anim1 = useRef(new Animated.Value(0.5)).current;
  const anim2 = useRef(new Animated.Value(0.5)).current;
  const anim3 = useRef(new Animated.Value(0.5)).current;
  const anim4 = useRef(new Animated.Value(0.5)).current;
  const anim5 = useRef(new Animated.Value(0.5)).current;

  const animations = [anim1, anim2, anim3, anim4, anim5];
  const durations = [400, 430, 450, 410, 440];

  useEffect(() => {
    const animLoop = (anim, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.5, duration: duration, useNativeDriver: true }),
        ])
      );
    };
    const loops = animations.map((anim, i) => animLoop(anim, durations[i]));
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, []);

  const barScales = animations.map((anim) => ({ transform: [{ scaleY: anim }] }));

  return (
    <View style={styles.waveformContainer}>
      <Animated.View style={[styles.waveformBar, { height: 40 }, barScales[0]]} />
      <Animated.View style={[styles.waveformBar, { height: 60 }, barScales[1]]} />
      <Animated.View style={[styles.waveformBar, { height: 30 }, barScales[2]]} />
      <Animated.View style={[styles.waveformBar, { height: 70 }, barScales[3]]} />
      <Animated.View style={[styles.waveformBar, { height: 50 }, barScales[4]]} />
    </View>
  );
}

export default function SivoApp() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [user, setUser] = useState(null);

  // Authentication Listener
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          if (currentScreen === 'Login' || currentScreen === 'Splash') {
            setCurrentScreen('Home');
          }
        } else {
          setUser(null);
          // Only redirect to login if not on splash (splash handles its own timing)
          if (currentScreen !== 'Splash') {
            setCurrentScreen('Login');
          }
        }
      });
      return unsubscribe;
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'Splash') {
      const timer = setTimeout(() => {
        // If not logged in, go to login. If logged in, listener handles it.
        if (!user) {
          setCurrentScreen('Login');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, user]);

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  const tabScreens = ['Home', 'History', 'Conversation', 'Settings'];
  const authScreens = ['Splash', 'Login'];
  const showTopBar = !authScreens.includes(currentScreen);
  const showBottomBar = tabScreens.includes(currentScreen);
  const isAuthScreen = authScreens.includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen />;
      case 'Login':
        return <LoginScreen navigate={navigate} />;
      case 'Home':
        return <HomeScreen navigate={navigate} />;
      case 'History':
        return <HistoryScreen />;
      case 'Conversation':
        return <LiveConversationScreen />;
      case 'SpeechToSign':
        return <SpeechToSignScreen navigate={navigate} />;
      case 'SignToSpeech':
        return <SignToSpeechScreen navigate={navigate} />;
      case 'Settings':
        return <SettingsScreen navigate={navigate} />;
      default:
        return <PlaceholderScreen title={currentScreen} navigate={navigate} />;
    }
  };

  if (isAuthScreen) {
    return (
      <ImageBackground source={authBackgroundImage} style={{ flex: 1 }}>
        <View style={styles.authOverlay}>
          <StatusBar barStyle="light-content" />
          {renderScreen()}
        </View>
      </ImageBackground>
    );
  }

  return (
    <LinearGradient colors={[SIVO_COLORS.background, SIVO_COLORS.bgLight]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {showTopBar && <TopBar screen={currentScreen} onBackClick={() => navigate('Home')} />}
      <View style={styles.screenContainer}>{renderScreen()}</View>
      {showBottomBar && <BottomTabBar currentScreen={currentScreen} navigate={navigate} />}
    </LinearGradient>
  );
}

function SplashScreen() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <View style={styles.splashContainer}>
      <Animated.Text
        style={[
          styles.splashText,
          {
            color: SIVO_COLORS.text,
            opacity: anim,
            transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
          },
        ]}
      >
        SIVO
      </Animated.Text>
    </View>
  );
}

function LoginScreen({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
       Alert.alert("Error", "Please enter email and password to sign up.");
       return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created! Logging you in...");
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Welcome Back</Text>
      <Text style={styles.loginSubtitle}>Sign in to continue</Text>
      <BlurView intensity={50} tint="dark" style={styles.loginGlassCard}>
        <View style={styles.loginInputWrapper}>
          <Text style={styles.loginLabel}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.loginInput}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter email"
            placeholderTextColor={SIVO_COLORS.textLight}
          />
        </View>
        <View style={styles.loginInputWrapper}>
          <Text style={styles.loginLabel}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.loginInput}
            secureTextEntry
            placeholder="Enter password"
            placeholderTextColor={SIVO_COLORS.textLight}
          />
        </View>
        <AnimatedActionButton
          title="Sign In"
          IconComponent={LogIn}
          onPress={handleSignIn}
          loading={loading}
          gradientColors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
        />
      </BlurView>
      <View style={styles.loginSignup}>
        <Text style={styles.loginSignupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUp} disabled={loading}>
          <Text style={[styles.loginSignupText, { color: SIVO_COLORS.mainButtonEnd, fontWeight: '600' }]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SettingsScreen({ navigate }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <SafeAreaView style={styles.settingsContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.placeholderTitle}>Settings</Text>
        <Text style={styles.placeholderText}>App preferences and account details.</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.homeListItem}>
            <Text style={styles.homeListItemText}>Account</Text>
            <ArrowRight size={20} color={SIVO_COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeListItem}>
            <Text style={styles.homeListItemText}>Notifications</Text>
            <ArrowRight size={20} color={SIVO_COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeListItem}>
            <Text style={styles.homeListItemText}>Appearance</Text>
            <ArrowRight size={20} color={SIVO_COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '100%', marginTop: 24 }}>
        <AnimatedActionButton
          title="Log Out"
          IconComponent={LogOut}
          onPress={handleSignOut}
          style={{ backgroundColor: SIVO_COLORS.card }}
        />
      </View>
    </SafeAreaView>
  );
}

function TopBar({ screen, onBackClick }) {
  const getTitle = () => {
    if (screen === 'Home') return 'SIVO';
    if (screen === 'History') return 'History';
    if (screen === 'Conversation') return 'Conversation';
    if (screen === 'SpeechToSign') return 'Speech → Sign';
    if (screen === 'SignToSpeech') return 'Sign → Speech';
    if (screen === 'Settings') return 'Settings';
    return 'SIVO';
  };
  const isHomeScreen = screen === 'Home';
  return (
    <LinearGradient
      colors={[SIVO_COLORS.topBarStart, SIVO_COLORS.topBarEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.topBarGradient}
    >
      <SafeAreaView style={styles.topBarSafe}>
        <View style={styles.topBar}>
          {isHomeScreen ? (
            <View style={styles.topBarButton} />
          ) : (
            <TouchableOpacity onPress={onBackClick} style={styles.topBarButton}>
              <ArrowLeft size={28} color={SIVO_COLORS.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.topBarTitle}>{getTitle()}</Text>
          <TouchableOpacity style={styles.topBarButton}>
            <User size={28} color={SIVO_COLORS.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function BottomTabBar({ currentScreen, navigate }) {
  const tabItems = [
    { name: 'Home', icon: Home, screen: 'Home' },
    { name: 'Conversation', icon: MessageSquare, screen: 'Conversation' },
    { name: 'History', icon: History, screen: 'History' },
    { name: 'Settings', icon: Settings, screen: 'Settings' },
  ];
  return (
    <LinearGradient
      colors={[SIVO_COLORS.bottomBarStart, SIVO_COLORS.bottomBarEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.tabBarGradient}
    >
      <SafeAreaView style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {tabItems.map((item) => {
            const isActive = currentScreen === item.screen;
            const iconColor = isActive ? SIVO_COLORS.text : SIVO_COLORS.textLight;
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => navigate(item.screen)}
                style={styles.tabBarItem}
              >
                <item.icon size={28} color={iconColor} />
                <Text style={[styles.tabBarLabel, { color: iconColor }]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function HomeScreen({ navigate }) {
  return (
    <ScrollView style={styles.homeContainer}>
      <Text style={styles.homeDescription}>
        SIVO bridges communication gaps by converting sign language to speech and speech to sign language in real-time.
      </Text>
      <View style={styles.homeGrid}>
        <TouchableOpacity onPress={() => navigate('SignToSpeech')} style={styles.homeGridButton}>
          <LinearGradient
            colors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
            style={styles.homeGridGradient}
          >
            <Camera size={48} color="#FFF" />
            <Text style={styles.homeGridButtonText}>Sign → Speech</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('SpeechToSign')} style={styles.homeGridButton}>
          <LinearGradient
            colors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
            style={styles.homeGridGradient}
          >
            <Mic size={48} color="#FFF" />
            <Text style={styles.homeGridButtonText}>Speech → Sign</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.homeList}>
        <TouchableOpacity
          onPress={() => navigate('Conversation')}
          style={[styles.homeListItem, { overflow: 'hidden', padding: 0 }]}
        >
          <LinearGradient
            colors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MessageSquare size={24} color={SIVO_COLORS.text} style={{ marginRight: 12 }} />
              <Text style={styles.homeListItemText}>Live Conversation</Text>
            </View>
            <ArrowRight size={24} color={SIVO_COLORS.text} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('History')}
          style={[styles.homeListItem, { overflow: 'hidden', padding: 0 }]}
        >
          <LinearGradient
            colors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <History size={24} color={SIVO_COLORS.text} style={{ marginRight: 12 }} />
              <Text style={styles.homeListItemText}>View History</Text>
            </View>
            <ArrowRight size={24} color={SIVO_COLORS.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function HistoryScreen() {
  const historyItems = [
    { type: 'Sign -> Speech', time: '2 minutes ago', text: 'Hello How Are You Today' },
    { type: 'Speech -> Sign', time: '1 hour ago', text: 'Hello, how can I help you today?' },
    { type: 'Sign -> Speech', time: '1 week ago', text: 'Thank You Very Much' },
    { type: 'Speech -> Sign', time: '1 week ago', text: 'Good morning, nice to meet you' },
    { type: 'Sign -> Speech', time: '2 days ago', text: 'Please Help Me' },
  ];
  return (
    <ScrollView style={styles.historyContainer}>
      {historyItems.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <View style={styles.historyItemHeader}>
            <Text
              style={[
                styles.historyItemTag,
                {
                  backgroundColor:
                    item.type === 'Sign -> Speech' ? SIVO_COLORS.coolButtonEnd : SIVO_COLORS.mainButtonEnd,
                  color: SIVO_COLORS.text,
                },
              ]}
            >
              {item.type}
            </Text>
            <Text style={styles.historyItemTime}>{item.time}</Text>
          </View>
          <Text style={styles.historyItemText}>{item.text}</Text>
          <View style={styles.historyItemFooter}>
            <TouchableOpacity>
              <AudioLines size={20} color={SIVO_COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Voicemail size={20} color={SIVO_COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function LiveConversationScreen() {
  const messages = [
    { user: 'me', text: 'Hello, how are you?' },
    { user: 'other', text: 'I am good, thank you!' },
    { user: 'me', text: 'So what are you doing?' },
  ];

  return (
    <View style={styles.chatContainer}>
      <ScrollView style={styles.chatMessagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.chatBubbleWrapper,
              msg.user === 'me' ? styles.chatBubbleWrapperMe : styles.chatBubbleWrapperOther,
            ]}
          >
            <View style={[styles.chatBubble, msg.user === 'me' ? styles.chatBubbleMe : styles.chatBubbleOther]}>
              <Text style={msg.user === 'me' ? styles.chatTextMe : styles.chatTextOther}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatBottomBar}>
        <TouchableOpacity>
          <Mic size={28} color={SIVO_COLORS.textLight} />
        </TouchableOpacity>
        <TextInput
          placeholder="Or type here..."
          placeholderTextColor={SIVO_COLORS.textLight}
          style={styles.chatInput}
        />
        <TouchableOpacity>
          <Send size={28} color={SIVO_COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SpeechToSignScreen({ navigate }) {
  const [status, setStatus] = useState('idle');

  const startRecording = () => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('converting');
    }, 3000);
  };
  
  const stopRecording = () => {
    setStatus('converting');
  };

  const reset = () => {
    setStatus('idle');
  };

  if (status === 'idle') {
    return (
      <View style={styles.speechContainer}>
        <View />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.speechIdleText}>Tap the microphone to start recording your voice</Text>
          <View style={[styles.waveformContainer, { marginBottom: 40 }]}>
            <View style={[styles.waveformBar, { height: 40, backgroundColor: SIVO_COLORS.card }]} />
            <View style={[styles.waveformBar, { height: 60, backgroundColor: SIVO_COLORS.card }]} />
            <View style={[styles.waveformBar, { height: 30, backgroundColor: SIVO_COLORS.card }]} />
            <View style={[styles.waveformBar, { height: 70, backgroundColor: SIVO_COLORS.card }]} />
            <View style={[styles.waveformBar, { height: 50, backgroundColor: SIVO_COLORS.card }]} />
          </View>
        </View>
        <AnimatedActionButton
          title="Start Recording"
          IconComponent={Mic}
          onPress={startRecording}
          gradientColors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
        />
      </View>
    );
  }
  
  if (status === 'recording') {
    return (
      <View style={styles.speechContainer}>
        <View style={styles.speechRecordingHeader}>
          <Text style={styles.speechRecordingText}>Recording in progress...</Text>
          <Text style={styles.speechRecordingRec}>● REC</Text>
        </View>
        <AnimatedWaveform />
        <AnimatedActionButton
          title="Stop Recording"
          IconComponent={MonitorStop}
          onPress={stopRecording}
          style={{ backgroundColor: SIVO_COLORS.card, width: '100%' }}
        />
      </View>
    );
  }
  
  if (status === 'converting') {
    return (
      <View style={styles.speechConvertingContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Text style={styles.speechConvertingSubtext}>Converting to sign language</Text>
          <Text style={styles.speechConvertingText}>Hello, how can I help you today?</Text>
          <View
            style={{
              backgroundColor: SIVO_COLORS.card,
              width: 192,
              height: 192,
              borderRadius: 96,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 32,
            }}
          >
            <User size={120} color={SIVO_COLORS.textLight} />
          </View>
          <Text style={{ color: SIVO_COLORS.textLight, fontSize: 18 }}>Sign complete</Text>
        </View>

        <View
          style={{
            height: 80,
            borderTopWidth: 1,
            borderTopColor: SIVO_COLORS.border,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => setStatus('converting')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <RefreshCcw size={28} color={SIVO_COLORS.textLight} />
            <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
              Repeat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Mic size={28} color={SIVO_COLORS.textLight} />
            <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
              Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate('SignToSpeech')}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Camera size={28} color={SIVO_COLORS.textLight} />
            <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
              Go to Sign
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return null;
}

function SignToSpeechScreen({ navigate }) {
  const [status, setStatus] = useState('idle');
  const [resultText, setResultText] = useState('Hello, how are you?');
  const [isRepeatingAudio, setIsRepeatingAudio] = useState(false);

  const startRecording = () => setStatus('recording');
  
  const stopRecording = () => {
    setStatus('translating');
    setTimeout(() => {
      setStatus('translated');
    }, 2000);
  };
  
  const reset = () => {
    setStatus('idle');
  };

  const playAudio = () => {
    setIsRepeatingAudio(true);
    setTimeout(() => {
      setIsRepeatingAudio(false);
    }, 2000);
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {(status === 'idle' || status === 'recording') && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={{ color: SIVO_COLORS.textLight, fontSize: 18, textAlign: 'center' }}>
            Frame yourself in the camera
          </Text>
          <View
            style={{
              width: '100%',
              aspectRatio: 3 / 4,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: SIVO_COLORS.card,
              backgroundColor: SIVO_COLORS.bgLight,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {status === 'recording' && (
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <View style={{ width: 12, height: 12, backgroundColor: 'red', borderRadius: 6 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>REC</Text>
              </View>
            )}
            <User size={120} color={SIVO_COLORS.card} />
          </View>
          <View style={{ marginTop: 32 }}>
            {status === 'idle' ? (
              <AnimatedActionButton
                title="Start Recording"
                IconComponent={Camera}
                onPress={startRecording}
                gradientColors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
              />
            ) : (
              <AnimatedActionButton
                title="Stop Recording"
                IconComponent={MonitorStop}
                onPress={stopRecording}
                style={{ backgroundColor: SIVO_COLORS.card }}
              />
            )}
          </View>
        </View>
      )}

      {status === 'translating' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={SIVO_COLORS.mainButtonEnd} />
          <Text style={{ color: SIVO_COLORS.textLight, fontSize: 18, marginTop: 16 }}>Translating...</Text>
        </View>
      )}

      {status === 'translated' && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: SIVO_COLORS.textLight, fontSize: 18, marginBottom: 16 }}>
              Translation complete
            </Text>
            <View
              style={{
                width: '100%',
                padding: 24,
                borderRadius: 16,
                backgroundColor: SIVO_COLORS.glass,
                borderWidth: 1,
                borderColor: SIVO_COLORS.glassBorder,
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: '600', color: SIVO_COLORS.text }}>{resultText}</Text>
            </View>
          </View>
          <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
            {isRepeatingAudio && <AnimatedWaveform />}
          </View>
          <View
            style={{
              height: 80,
              borderTopWidth: 1,
              borderTopColor: SIVO_COLORS.border,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginHorizontal: -24,
            }}
          >
            <TouchableOpacity
              onPress={playAudio}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <AudioLines size={28} color={SIVO_COLORS.textLight} />
              <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
                Repeat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={28} color={SIVO_COLORS.textLight} />
              <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
                New Sign
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('SpeechToSign')}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Mic size={28} color={SIVO_COLORS.textLight} />
              <Text style={{ color: SIVO_COLORS.textLight, fontSize: 10, fontWeight: '600', marginTop: 4 }}>
                Go to Speech
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function PlaceholderScreen({ title, navigate }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: SIVO_COLORS.text }}>{title}</Text>
      <Text style={{ color: SIVO_COLORS.textLight, fontSize: 18, marginTop: 8 }}>
        This screen is under construction.
      </Text>
      <View style={{ marginTop: 32, width: '100%' }}>
        <AnimatedActionButton
          title="Go Back Home"
          IconComponent={Home}
          onPress={() => navigate('Home')}
          gradientColors={[SIVO_COLORS.mainButtonStart, SIVO_COLORS.mainButtonEnd]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  authOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: SIVO_COLORS.text,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 18,
    color: SIVO_COLORS.textLight,
    marginBottom: 32,
  },
  loginGlassCard: {
    padding: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  loginInputWrapper: {
    marginBottom: 20,
  },
  loginLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SIVO_COLORS.text,
    marginBottom: 8,
  },
  loginInput: {
    backgroundColor: SIVO_COLORS.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: SIVO_COLORS.text,
  },
  loginSignup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginSignupText: {
    color: SIVO_COLORS.textLight,
    fontSize: 16,
  },
  animatedButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  animatedButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  topBarGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBarSafe: {
    width: '100%',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SIVO_COLORS.text,
  },
  tabBarGradient: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabBarContainer: {
    width: '100%',
  },
  tabBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  screenContainer: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    padding: 24,
  },
  homeDescription: {
    fontSize: 16,
    color: SIVO_COLORS.textLight,
    marginBottom: 24,
    lineHeight: 24,
  },
  homeGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  homeGridButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  homeGridGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeGridButtonText: {
    color: SIVO_COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  homeList: {
    gap: 16,
  },
  homeListItem: {
    backgroundColor: SIVO_COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeListItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: SIVO_COLORS.text,
  },
  historyContainer: {
    flex: 1,
    padding: 24,
  },
  historyItem: {
    backgroundColor: SIVO_COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyItemTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  historyItemTime: {
    fontSize: 12,
    color: SIVO_COLORS.textLight,
  },
  historyItemText: {
    fontSize: 16,
    color: SIVO_COLORS.text,
    marginBottom: 12,
  },
  historyItemFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  chatContainer: {
    flex: 1,
  },
  chatMessagesContainer: {
    flex: 1,
    padding: 24,
  },
  chatBubbleWrapper: {
    marginBottom: 12,
  },
  chatBubbleWrapperMe: {
    alignItems: 'flex-end',
  },
  chatBubbleWrapperOther: {
    alignItems: 'flex-start',
  },
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  chatBubbleMe: {
    backgroundColor: SIVO_COLORS.mainButtonEnd,
    borderBottomRightRadius: 0,
  },
  chatBubbleOther: {
    backgroundColor: SIVO_COLORS.card,
    borderBottomLeftRadius: 0,
  },
  chatTextMe: {
    color: SIVO_COLORS.text,
    fontSize: 16,
  },
  chatTextOther: {
    color: SIVO_COLORS.text,
    fontSize: 16,
  },
  chatBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: SIVO_COLORS.card,
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: SIVO_COLORS.glass,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: SIVO_COLORS.text,
    fontSize: 16,
  },
  speechContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  speechIdleText: {
    fontSize: 18,
    color: SIVO_COLORS.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  speechRecordingHeader: {
    alignItems: 'center',
  },
  speechRecordingText: {
    fontSize: 18,
    color: SIVO_COLORS.text,
    marginBottom: 8,
  },
  speechRecordingRec: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  speechConvertingContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  speechConvertingSubtext: {
    fontSize: 16,
    color: SIVO_COLORS.textLight,
    marginBottom: 16,
  },
  speechConvertingText: {
    fontSize: 24,
    fontWeight: '600',
    color: SIVO_COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 80,
  },
  waveformBar: {
    width: 6,
    backgroundColor: SIVO_COLORS.mainButtonEnd,
    borderRadius: 3,
  },
  settingsContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  settingsList: {
    marginTop: 24,
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SIVO_COLORS.text,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: SIVO_COLORS.textLight,
  },
});