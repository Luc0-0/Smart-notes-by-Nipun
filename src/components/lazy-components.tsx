import { lazy } from 'react';

export const LazyEditor = lazy(() => import('./editor').then(m => ({ default: m.Editor })));
export const LazyDashboard = lazy(() => import('./dashboard').then(m => ({ default: m.Dashboard })));
export const LazyNoteList = lazy(() => import('./note-list').then(m => ({ default: m.NoteList })));