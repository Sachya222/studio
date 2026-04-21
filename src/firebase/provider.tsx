
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * Provider component that initializes Firebase services and monitors auth state.
 * Specifically handles the result of signInWithRedirect.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Firebase services not provided.") });
      return;
    }

    // Handle the result of a sign-in redirect when the page reloads
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Successfully signed in via redirect:", result.user.displayName);
        }
      })
      .catch((error) => {
        console.error("Error handling auth redirect:", error);
      });

    // Listen for authentication state changes (login, logout, session persistence)
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // Sync User Profile to Firestore to ensure we have record of the student
          const userRef = doc(firestore, 'users', firebaseUser.uid);
          try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
              setDocumentNonBlocking(userRef, {
                id: firebaseUser.uid,
                fullName: firebaseUser.displayName || 'Anonymous Student',
                email: firebaseUser.email || '',
                collegeName: 'SRMU Lucknow', 
                courseYear: 'Not Specified',
                profilePhotoUrl: firebaseUser.photoURL || '',
                isVerified: firebaseUser.emailVerified || false,
                averageRating: 0,
                joinedDate: new Date().toISOString(),
                role: 'student'
              }, { merge: true });
            }
          } catch (e) {
            console.error("Error syncing user profile:", e);
          }
        }
        
        setUserAuthState({ 
          user: firebaseUser, 
          isUserLoading: false, 
          userError: null 
        });
      },
      (error) => {
        console.error("Auth state change error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );

    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth && storage);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, storage, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth || !context.storage) {
    throw new Error('Firebase core services not available.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    storage: context.storage,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useStorage = (): FirebaseStorage => {
  const { storage } = useFirebase();
  return storage;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
