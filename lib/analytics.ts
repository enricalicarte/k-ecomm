import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type EventType = 'page_view' | 'email_click' | 'whatsapp_click' | 'internal_link_click' | 'add_to_cart' | 'checkout';

export interface AnalyticsEvent {
  type: EventType;
  path: string;
  source?: string; // e.g. which product they clicked
  metadata?: Record<string, any>;
  timestamp?: any;
  visitorId?: string;
}

const getVisitorId = () => {
    if (typeof window === 'undefined') return 'unknown';
    let vId;
    try {
        vId = localStorage.getItem('studio_k_visitor_id');
        if (!vId) {
            vId = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('studio_k_visitor_id', vId);
        }
    } catch(e) {
        vId = 'unknown';
    }
    return vId;
};

export const trackEvent = async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
  try {
    const visitorId = getVisitorId();
    await addDoc(collection(db, 'analytics'), {
      ...event,
      visitorId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    if (typeof window !== 'undefined') {
        console.error('Error tracking event:', error);
    } else {
        handleFirestoreError(error, OperationType.CREATE, 'analytics');
    }
  }
};
