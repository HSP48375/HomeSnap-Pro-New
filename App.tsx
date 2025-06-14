import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ChatInterface from "./components/ChatInterface"; // Ensuring correct import

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import UploadScreen from "./src/screens/UploadScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import OrderDetailsScreen from "./src/screens/OrderDetailsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import FloorplanScreen from "./mobile/src/screens/FloorplanScreen";
import FloorplanEditorScreen from "./mobile/src/screens/FloorplanEditorScreen";
import RevisionRequestScreen from "./src/screens/RevisionRequestScreen";
import NotificationPreferencesScreen from "./src/screens/NotificationPreferencesScreen";
// Import OnboardingTour component
import OnboardingTour from "./src/components/OnboardingTour";

// Admin Panel Pages
import { 
  AdminDashboard, 
  OrderManagement, 
  EditorAssignment, 
  QualityControl,
  UserManagement,
  NotificationManager,
  EditorManagement,
  AddOnManagement,
  JobFolderSystem,
  DiscountManager,
  PaymentDashboard,
  TutorialManager,
  SuggestionsConfig,
  FloorplanManager,
  ReportingDashboard
} from "./src/pages/admin";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Import our new pages
import OrdersPage from "./src/pages/OrdersPage";
import NewListingPage from "./src/pages/NewListingPage";
import PhotoSelectionPage from "./src/pages/PhotoSelectionPage";
import PhotoAddonsPage from "./src/pages/PhotoAddonsPage";
import CheckoutPage from "./src/pages/CheckoutPage";
import PropertyDetailsPage from "./src/pages/PropertyDetailsPage";
import FloorplanPage from "./src/pages/FloorplanPage";
import FloorplanDetailsPage from "./src/pages/FloorplanDetailsPage";

const MainTabs = () => (
  <>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Upload":
              iconName = "upload";
              break;
            case "Orders":
              iconName = "file-text";
              break;
            case "Profile":
              iconName = "user";
              break;
            case "Floorplans":
              iconName = "layout";
              break;
            default:
              iconName = "circle";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00EEFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#0A0A14",
          borderTopColor: "rgba(255, 255, 255, 0.1)",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Orders" component={OrdersPage} />
      <Tab.Screen name="Floorplans" component={FloorplanPage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>

    {/* Chatbot placed at the bottom */}
    <ChatInterface />
  </>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000000" },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
          <Stack.Screen name="orders" component={OrdersPage} />
          <Stack.Screen name="new-listing" component={NewListingPage} />
          <Stack.Screen name="photo-selection" component={PhotoSelectionPage} />
          <Stack.Screen name="photo-addons" component={PhotoAddonsPage} />
          <Stack.Screen name="checkout" component={CheckoutPage} />
          <Stack.Screen name="property/:id" component={PropertyDetailsPage} />
          <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
          <Stack.Screen name="SubscriptionConfirmation" component={SubscriptionConfirmationScreen} />
          <Stack.Screen name="ProfileSubscriptions" component={ProfileSubscriptionsScreen} />
          <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
          
          {/* Floorplan Routes */}
          <Stack.Screen name="floorplans" component={FloorplanPage} />
          <Stack.Screen name="floorplan/:id" component={FloorplanDetailsPage} />
          <Stack.Screen name="floorplan-scan" component={FloorplanScreen} />
          <Stack.Screen name="floorplan-editor" component={FloorplanEditorScreen} />
          <Stack.Screen name="revision-request" component={RevisionRequestScreen} />
          
          {/* Admin Panel Routes */}
          <Stack.Screen name="admin" component={AdminDashboard} />
          <Stack.Screen name="admin/orders" component={OrderManagement} />
          <Stack.Screen name="admin/editor-assignment" component={EditorAssignment} />
          <Stack.Screen name="admin/quality-control" component={QualityControl} />
          <Stack.Screen name="admin/users" component={UserManagement} />
          <Stack.Screen name="admin/notifications" component={NotificationManager} />
          <Stack.Screen name="admin/editor-management" component={EditorManagement} />
          <Stack.Screen name="admin/add-on-management" component={AddOnManagement} />
          <Stack.Screen name="admin/job-folders" component={JobFolderSystem} />
          <Stack.Screen name="admin/discounts" component={DiscountManager} />
          <Stack.Screen name="admin/payments" component={PaymentDashboard} />
          <Stack.Screen name="admin/tutorials" component={TutorialManager} />
          <Stack.Screen name="admin/suggestions" component={SuggestionsConfig} />
          <Stack.Screen name="admin/floorplans" component={FloorplanManager} />
          <Stack.Screen name="admin/reports" component={ReportingDashboard} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
