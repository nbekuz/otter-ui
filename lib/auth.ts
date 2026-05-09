/**
 * Modular Firebase Auth (v9+). Namespace `firebase.auth()` ishlatilmaydi.
 */
import type { FirebaseOptions } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import { getFirebaseApp } from './firebase'

export type AuthenticatedUserData = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

function userToData(user: User): AuthenticatedUserData {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  }
}

/**
 * Google popup orqali kirish. Xatoliklar `console.error` bilan yoziladi.
 */
export async function loginWithGoogle(config: FirebaseOptions): Promise<AuthenticatedUserData> {
  const auth = getAuth(getFirebaseApp(config))
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  try {
    const credential = await signInWithPopup(auth, provider)
    return userToData(credential.user)
  }
  catch (err) {
    console.error('[loginWithGoogle]', err)
    throw err
  }
}

export type AuthStateCallback = (user: AuthenticatedUserData | null) => void

/**
 * `onAuthStateChanged` — qaytarilgan funksiya bilan obunani bekor qilish mumkin.
 */
export function subscribeAuthState(
  config: FirebaseOptions,
  callback: AuthStateCallback,
) {
  const auth = getAuth(getFirebaseApp(config))
  return onAuthStateChanged(auth, (user) => {
    callback(user ? userToData(user) : null)
  })
}
