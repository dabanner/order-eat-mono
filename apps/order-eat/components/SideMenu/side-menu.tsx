import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MaterialIcons,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather
} from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'expo-router';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

type IconName = 
  | React.ComponentProps<typeof Ionicons>['name']
  | React.ComponentProps<typeof MaterialIcons>['name']
  | React.ComponentProps<typeof FontAwesome>['name']
  | React.ComponentProps<typeof MaterialCommunityIcons>['name']
  | React.ComponentProps<typeof Feather>['name'];

interface MenuItem {
  id: string;
  icon: IconName;
  iconSet: typeof Ionicons | typeof MaterialIcons | typeof FontAwesome | typeof MaterialCommunityIcons | typeof Feather;
  label: string;
  color: string;
}

interface MenuSection {
  section: number;
  items: MenuItem[];
}

const IconComponent: React.FC<{ item: MenuItem }> = ({ item }) => {
  const IconSet = item.iconSet;
  return <IconSet name={item.icon as any} size={24} color={item.color} />;
};

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { user, logout } = useUserStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
    onClose();
  };

  const menuItems: MenuSection[] = [
    {
      section: 1,
      items: [
        { id: 'personal', icon: 'person-outline', iconSet: Ionicons, label: 'Personal Info', color: '#FF8C00' },
        { id: 'addresses', icon: 'location-outline', iconSet: Ionicons, label: 'Addresses', color: '#4B7BE5' },
      ]
    },
    {
      section: 2,
      items: [
        { id: 'cart', icon: 'cart-outline', iconSet: Ionicons, label: 'Cart', color: '#4B7BE5' },
        { id: 'heart-outline', icon: 'heart-outline', iconSet: Ionicons, label: 'Favourite', color: '#E5344B' },
        { id: 'notifications', icon: 'notifications-outline', iconSet: Ionicons, label: 'Notifications', color: '#FFB443' },
        { id: 'payment', icon: 'card-outline', iconSet: Ionicons, label: 'Payment Method', color: '#4B7BE5' },
      ]
    },
    {
      section: 3,
      items: [
        { id: 'faqs', icon: 'help-circle-outline', iconSet: Ionicons, label: 'FAQs', color: '#FF8C00' },
        { id: 'reviews', icon: 'star-outline', iconSet: Ionicons, label: 'User Reviews', color: '#00BFA5' },
        { id: 'settings', icon: 'settings-outline', iconSet: Ionicons, label: 'Settings', color: '#4B7BE5' },
      ]
    },
    {
      section: 4,
      items: [
        { id: 'logout', icon: 'log-out-outline', iconSet: Ionicons, label: 'Log Out', color: '#E5344B' },
      ]
    }
  ];

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.menuContainer}>
        <SafeAreaView style={styles.content}>
          <ScrollView>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: user?.profileImage || '/placeholder.svg?height=120&width=120' }}
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.name}>{user?.name || 'Guest'}</Text>
              <Text style={styles.bio}>I love fast food</Text>
            </View>

            {/* Menu Items */}
            {menuItems.map((section) => (
              <View key={section.section} style={[styles.section, section.section > 1 && styles.sectionMargin]}>
                {section.items.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.menuItem}
                    onPress={item.id === 'logout' ? handleLogout : onClose}
                  >
                    <View style={styles.menuItemContent}>
                      <IconComponent item={item} />
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
      <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    flexDirection: 'row',
  },
  dismissArea: {
    flex: 1,
  },
  menuContainer: {
    width: '80%',
    maxWidth: 360,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '-2px 0px 8px rgba(0, 0, 0, 0.1)',
        '@media (min-width: 768px)': {
          width: '30%',
          maxWidth: 400,
        },
      },
    }),
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profile: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE5DC',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 8,
    margin: 16,
  },
  sectionMargin: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

