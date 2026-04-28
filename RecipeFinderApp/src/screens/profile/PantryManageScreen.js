import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '../../context/ThemeContext';
import { usePantry } from '../../context/PantryContext';
import { typography, spacing, radius, colors } from '../../theme';

import AppHeader from '../../components/common/AppHeader';
import {
  EditIcon,
  UpIcon,
  DownIcon,
  PlusIcon,
  CloseIcon,
} from '../../components/icons/commonIcons';

const PantryManageScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    pantryItems,
    addPantryItem,
    removePantryItem,
    renamePantryItem,
    movePantryItem,
  } = usePantry();

  const [addVisible, setAddVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const openAddModal = () => {
    setNewItem('');
    setAddVisible(true);
  };

  const closeAddModal = () => {
    setNewItem('');
    setAddVisible(false);
  };

  const openRenameModal = item => {
    setEditingItem(item);
    setRenameValue(item.ingredientName || '');
    setRenameVisible(true);
  };

  const closeRenameModal = () => {
    setEditingItem(null);
    setRenameValue('');
    setRenameVisible(false);
  };

  const handleConfirmAdd = () => {
    const trimmed = newItem.trim();

    if (!trimmed) {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    const isDuplicate = pantryItems.some(
      item =>
        (item.ingredientName || '').toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', `"${trimmed}" already exists.`);
      return;
    }

    addPantryItem(trimmed);
    closeAddModal();
    Alert.alert('Success', `"${trimmed}" added.`);
  };

  const handleConfirmRename = () => {
    const trimmed = renameValue.trim();

    if (!trimmed) {
      Alert.alert('Error', 'Please enter an item name.');
      return;
    }

    const isDuplicate = pantryItems.some(
      item =>
        item.id !== editingItem?.id &&
        (item.ingredientName || '').toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', `"${trimmed}" already exists.`);
      return;
    }

    renamePantryItem(editingItem, trimmed);
    closeRenameModal();
    Alert.alert('Success', 'Renamed successfully.');
  };

  const confirmRemove = item => {
    Alert.alert('Remove', `Remove "${item.ingredientName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => removePantryItem(item) },
    ]);
  };

  const renderRightActions = item => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => confirmRemove(item)}
      activeOpacity={0.85}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.headerWrap}>
        <AppHeader
          title="Pantry"
          variant="profile"
          showBack
          onBack={() => navigation.goBack()}
        />

        <View style={styles.addBtnWrapper}>
          <TouchableOpacity
            onPress={openAddModal}
            style={styles.headerAddBtn}
            activeOpacity={0.85}
          >
            <PlusIcon color="#fff" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.listCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {pantryItems.map((item, index) => (
            <Swipeable
              key={item.id}
              overshootRight={false}
              renderRightActions={() => renderRightActions(item)}
            >
              <View style={[styles.row, { borderBottomColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {item.ingredientName}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => openRenameModal(item)}
                    activeOpacity={0.8}
                  >
                    <EditIcon color={colors.orange} size={18} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => movePantryItem(index, index - 1)}
                    disabled={index === 0}
                    activeOpacity={0.8}
                  >
                    <UpIcon
                      color={index === 0 ? theme.textMuted : colors.orange}
                      size={16}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => movePantryItem(index, index + 1)}
                    disabled={index === pantryItems.length - 1}
                    activeOpacity={0.8}
                  >
                    <DownIcon
                      color={
                        index === pantryItems.length - 1
                          ? theme.textMuted
                          : colors.orange
                      }
                      size={16}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Swipeable>
          ))}

          {pantryItems.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No custom pantry items yet.
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal visible={addVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={closeAddModal}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: theme.card }]}
            onPress={() => {}}
          >
            <TouchableOpacity
              onPress={closeAddModal}
              style={styles.closeBtn}
              activeOpacity={0.8}
            >
              <CloseIcon color={theme.text} size={16} />
            </TouchableOpacity>

            <View style={styles.modalIconWrap}>
              <View style={styles.modalIconCircle}>
                <PlusIcon color="#fff" size={26} />
              </View>
            </View>

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add Pantry Item
            </Text>

            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Enter pantry item"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.modalInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={closeAddModal}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmAdd}
                style={styles.saveBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={renameVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={closeRenameModal}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: theme.card }]}
            onPress={() => {}}
          >
            <TouchableOpacity
              onPress={closeRenameModal}
              style={styles.closeBtn}
              activeOpacity={0.8}
            >
              <CloseIcon color={theme.text} size={16} />
            </TouchableOpacity>

            <View style={styles.modalIconWrap}>
              <View style={styles.modalIconCircle}>
                <EditIcon color="#fff" size={22} />
              </View>
            </View>

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Rename Item
            </Text>

            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder={`Rename: ${editingItem?.ingredientName || ''}`}
              placeholderTextColor={theme.textMuted}
              style={[
                styles.modalInput,
                {
                  color: theme.text,
                  borderColor: colors.orange,
                  backgroundColor: theme.background,
                },
              ]}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                onPress={closeRenameModal}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmRename}
                style={styles.saveBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerWrap: { position: 'relative' },
  addBtnWrapper: {
    position: 'absolute',
    right: 16,
    top: 20,
    zIndex: 999,
    elevation: 10,
  },
  headerAddBtn: {
    marginTop: 15,
    width: 30,
    height: 30,
    borderRadius: 22,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.base,
    paddingBottom: 100,
  },
  listCard: {
    borderWidth: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  row: {
    minHeight: 86,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  deleteAction: {
    width: 90,
    backgroundColor: '#FF6B3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    padding: spacing.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    borderRadius: 22,
    padding: 18,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 20,
    padding: 6,
  },
  modalIconWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: typography.sizes.base,
    marginBottom: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  cancelBtnText: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.orange,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },
});

export default PantryManageScreen;