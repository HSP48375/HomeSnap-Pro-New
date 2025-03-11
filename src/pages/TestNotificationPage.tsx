import React from 'react';
import TestNotification from '../components/ui/TestNotification';
import NotificationQuery from '../components/ui/NotificationQuery';
import NotificationPreferencesSchema from '../components/ui/NotificationPreferencesSchema';

const TestNotificationPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Notification Testing</h1>
        <p className="text-white/70 mt-2">
          Use this page to test the notification system and view schema information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TestNotification />

          <div className="card p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">How to Test</h2>
            <ol className="list-decimal pl-5 space-y-2 text-white/70">
              <li>Click the "Create Test Notification" button above</li>
              <li>Look for the notification bell in the top navigation bar</li>
              <li>If there's a number badge on the bell, click it to open the notification center</li>
              <li>You should see your test notification in the dropdown</li>
              <li>Try marking it as read or deleting it to test those functions</li>
              <li>Click the "Refresh" button on the right panel to see your new notification in the database</li>
            </ol>
          </div>
        </div>

        <div className="space-y-8">
          <NotificationQuery />
          <NotificationPreferencesSchema />
        </div>
      </div>
    </div>
  );
};

export default TestNotificationPage;