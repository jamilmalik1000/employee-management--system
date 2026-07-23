// import { cert, getApps, initializeApp } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { getFirestore } from "firebase-admin/firestore";
// import type { ServiceAccount } from "firebase-admin/app";

// import serviceAccount from "../keys/firebase-admin.json";

// const adminApp =
//   getApps().length === 0
//     ? initializeApp({
//         credential: cert(serviceAccount as ServiceAccount),
//       })
//     : getApps()[0];

// export const adminAuth = getAuth(adminApp);
// export const adminDb = getFirestore(adminApp);

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "employee-management-system";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasServiceAccount = Boolean(projectId && clientEmail && privateKey);

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(
        hasServiceAccount
          ? {
              credential: cert({
                projectId,
                clientEmail,
                privateKey,
              }),
              projectId,
            }
          : { projectId }
      );

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
