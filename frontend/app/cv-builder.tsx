// CV Builder Screen — Create and manage CV for candidates
import { Button, LoadingSpinner, TextField } from '@components/index';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { useAuth } from '@hooks/index';
import { cvService } from '@services/cvService';
import { CV, CVSection, CVTemplate, SectionItem } from '@/types/cv.types';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Step = 'template' | 'personal' | 'sections' | 'preview';

const SECTION_TYPES = [
  { type: 'EXPERIENCE', label: 'Kinh nghiệm làm việc' },
  { type: 'EDUCATION', label: 'Học vấn' },
  { type: 'SKILL', label: 'Kỹ năng' },
  { type: 'CERTIFICATION', label: 'Chứng chỉ' },
  { type: 'PROJECT', label: 'Dự án' },
  { type: 'LANGUAGE', label: 'Ngoại ngữ' },
] as const;

export default function CVBuilderScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const user = state.user;

  const [step, setStep] = useState<Step>('template');
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingCVs, setExistingCVs] = useState<CV[]>([]);

  // CV Data
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1a56db');
  const [title, setTitle] = useState('CV của tôi');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [summary, setSummary] = useState('');
  const [sections, setSections] = useState<CVSection[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tpls, cvs] = await Promise.all([
        cvService.getTemplates(),
        cvService.getCVs(),
      ]);
      setTemplates(tpls);
      setExistingCVs(cvs.result);
      if (tpls.length > 0) {
        setSelectedTemplate(tpls[0].id);
        setSelectedColor(tpls[0].colors[0]);
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = (type: string) => {
    const config = SECTION_TYPES.find(s => s.type === type);
    if (!config) return;
    const newSection: CVSection = {
      id: `sect-${Date.now()}`,
      type: type as CVSection['type'],
      title: config.label,
      items: [],
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const addItemToSection = (sectionId: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newItem: SectionItem = {
        id: `item-${Date.now()}`,
        title: '',
        subtitle: '',
        description: '',
        startDate: '',
        endDate: '',
        order: s.items.length,
      };
      return { ...s, items: [...s.items, newItem] };
    }));
  };

  const updateSectionItem = (sectionId: string, itemId: string, field: string, value: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const handleSave = async () => {
    if (!fullName || !email) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên và email');
      return;
    }
    setSaving(true);
    try {
      await cvService.createCV({
        title,
        template: selectedTemplate,
        color: selectedColor,
        personalInfo: { fullName, email, phone, address, summary },
        sections,
      });
      Alert.alert('Thành công', 'CV của bạn đã được lưu!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu CV. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const getStepIndex = () => ['template', 'personal', 'sections', 'preview'].indexOf(step);
  const canGoNext = () => {
    if (step === 'template') return !!selectedTemplate;
    if (step === 'personal') return !!fullName && !!email;
    return true;
  };

  const goNext = () => {
    const steps: Step[] = ['template', 'personal', 'sections', 'preview'];
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const goBack = () => {
    const steps: Step[] = ['template', 'personal', 'sections', 'preview'];
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  if (loading) return <LoadingSpinner fullScreen message="Đang tải..." />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {['Mẫu CV', 'Thông tin', 'Nội dung', 'Xem trước'].map((label, idx) => (
          <View key={idx} style={styles.progressStep}>
            <View style={[styles.progressDot, idx <= getStepIndex() && styles.progressDotActive]}>
              <Text style={[styles.progressDotText, idx <= getStepIndex() && styles.progressDotTextActive]}>
                {idx < getStepIndex() ? '✓' : idx + 1}
              </Text>
            </View>
            <Text style={[styles.progressLabel, idx <= getStepIndex() && styles.progressLabelActive]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Chọn mẫu CV</Text>
            <Text style={styles.stepSubtitle}>Chọn một mẫu thiết kế phù hợp với bạn</Text>

            {/* Existing CVs */}
            {existingCVs.length > 0 && (
              <View style={styles.existingSection}>
                <Text style={styles.existingLabel}>CV đã tạo ({existingCVs.length})</Text>
                {existingCVs.map(cv => (
                  <View key={cv.id} style={styles.existingCard}>
                    <View style={[styles.existingColor, { backgroundColor: cv.color }]} />
                    <View style={styles.existingInfo}>
                      <Text style={styles.existingTitle}>{cv.title}</Text>
                      <Text style={styles.existingDate}>
                        Tạo ngày {new Date(cv.createdAt).toLocaleDateString('vi-VN')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Templates Grid */}
            <View style={styles.templateGrid}>
              {templates.map(tpl => (
                <TouchableOpacity
                  key={tpl.id}
                  style={[styles.templateCard, selectedTemplate === tpl.id && styles.templateCardSelected]}
                  onPress={() => {
                    setSelectedTemplate(tpl.id);
                    setSelectedColor(tpl.colors[0]);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.templatePreview, { backgroundColor: tpl.colors[0] + '20' }]}>
                    <View style={[styles.templateLine, { backgroundColor: tpl.colors[0] }]} />
                    <View style={[styles.templateLine, styles.templateLineShort, { backgroundColor: tpl.colors[0] + '60' }]} />
                    <View style={[styles.templateLine, { backgroundColor: tpl.colors[0] + '40' }]} />
                    <View style={[styles.templateLine, styles.templateLineShort, { backgroundColor: tpl.colors[0] + '30' }]} />
                  </View>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                  <Text style={styles.templateDesc}>{tpl.description}</Text>
                  {/* Color Options */}
                  <View style={styles.colorRow}>
                    {tpl.colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                  {selectedTemplate === tpl.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Personal Info */}
        {step === 'personal' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Thông tin cá nhân</Text>
            <Text style={styles.stepSubtitle}>Điền thông tin cơ bản của bạn</Text>

            <TextField label="Tiêu đề CV" placeholder="Vd: CV Senior Developer" value={title} onChangeText={setTitle} />
            <TextField label="Họ và tên *" placeholder="Nhập họ tên đầy đủ" value={fullName} onChangeText={setFullName} />
            <TextField label="Email *" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextField label="Số điện thoại" placeholder="0xxx xxx xxx" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextField label="Địa chỉ" placeholder="Thành phố, Quận/Huyện" value={address} onChangeText={setAddress} />
            <TextField label="Giới thiệu bản thân" placeholder="Mô tả ngắn gọn về bạn, mục tiêu nghề nghiệp..." value={summary} onChangeText={setSummary} multiline numberOfLines={4} />
          </View>
        )}

        {/* Step 3: CV Sections */}
        {step === 'sections' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Nội dung CV</Text>
            <Text style={styles.stepSubtitle}>Thêm các phần nội dung cho CV của bạn</Text>

            {/* Add Section Buttons */}
            <View style={styles.addSectionRow}>
              {SECTION_TYPES.map(st => {
                const alreadyAdded = sections.some(s => s.type === st.type);
                return (
                  <TouchableOpacity
                    key={st.type}
                    style={[styles.addSectionChip, alreadyAdded && styles.addSectionChipDisabled]}
                    onPress={() => !alreadyAdded && addSection(st.type)}
                    disabled={alreadyAdded}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.addSectionText, alreadyAdded && styles.addSectionTextDisabled]}>
                      {alreadyAdded ? '✓ ' : '+ '}{st.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Section Editors */}
            {sections.map(section => (
              <View key={section.id} style={styles.sectionEditor}>
                <View style={styles.sectionEditorHeader}>
                  <Text style={styles.sectionEditorTitle}>{section.title}</Text>
                  <TouchableOpacity onPress={() => removeSection(section.id)}>
                    <Text style={styles.removeBtn}>Xóa</Text>
                  </TouchableOpacity>
                </View>

                {section.items.map((item, itemIdx) => (
                  <View key={item.id} style={styles.itemEditor}>
                    <Text style={styles.itemLabel}>Mục {itemIdx + 1}</Text>
                    <TextField
                      label={section.type === 'EDUCATION' ? 'Trường / Cơ sở đào tạo' : 'Công ty / Tổ chức'}
                      placeholder="Nhập tên..."
                      value={item.title}
                      onChangeText={(v) => updateSectionItem(section.id, item.id, 'title', v)}
                    />
                    <TextField
                      label={section.type === 'EDUCATION' ? 'Ngành học / Bằng cấp' : 'Vị trí / Chức vụ'}
                      placeholder="Nhập..."
                      value={item.subtitle || ''}
                      onChangeText={(v) => updateSectionItem(section.id, item.id, 'subtitle', v)}
                    />
                    <TextField
                      label="Mô tả chi tiết"
                      placeholder="Mô tả công việc, thành tích..."
                      value={item.description || ''}
                      onChangeText={(v) => updateSectionItem(section.id, item.id, 'description', v)}
                      multiline
                      numberOfLines={3}
                    />
                    <View style={styles.dateRow}>
                      <View style={{ flex: 1, marginRight: SPACING.sm }}>
                        <TextField label="Từ" placeholder="01/2023" value={item.startDate || ''} onChangeText={(v) => updateSectionItem(section.id, item.id, 'startDate', v)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextField label="Đến" placeholder="Hiện tại" value={item.endDate || ''} onChangeText={(v) => updateSectionItem(section.id, item.id, 'endDate', v)} />
                      </View>
                    </View>
                  </View>
                ))}

                <TouchableOpacity style={styles.addItemBtn} onPress={() => addItemToSection(section.id)}>
                  <Text style={styles.addItemText}>+ Thêm mục</Text>
                </TouchableOpacity>
              </View>
            ))}

            {sections.length === 0 && (
              <View style={styles.emptySections}>
                <Text style={styles.emptySectionsText}>
                  Chọn các phần ở trên để thêm vào CV
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Step 4: Preview */}
        {step === 'preview' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Xem trước CV</Text>
            <Text style={styles.stepSubtitle}>Kiểm tra lại thông tin trước khi lưu</Text>

            <View style={[styles.previewCard, { borderTopWidth: 4, borderTopColor: selectedColor }]}>
              <Text style={[styles.previewName, { color: selectedColor }]}>{fullName}</Text>
              <Text style={styles.previewContact}>{email} • {phone}</Text>
              {address ? <Text style={styles.previewContact}>{address}</Text> : null}

              {summary ? (
                <View style={styles.previewSection}>
                  <Text style={[styles.previewSectionTitle, { color: selectedColor }]}>Giới thiệu</Text>
                  <Text style={styles.previewText}>{summary}</Text>
                </View>
              ) : null}

              {sections.map(section => (
                <View key={section.id} style={styles.previewSection}>
                  <Text style={[styles.previewSectionTitle, { color: selectedColor }]}>{section.title}</Text>
                  {section.items.map(item => (
                    <View key={item.id} style={styles.previewItem}>
                      {item.title ? <Text style={styles.previewItemTitle}>{item.title}</Text> : null}
                      {item.subtitle ? <Text style={styles.previewItemSubtitle}>{item.subtitle}</Text> : null}
                      {(item.startDate || item.endDate) ? (
                        <Text style={styles.previewItemDate}>{item.startDate} — {item.endDate || 'Hiện tại'}</Text>
                      ) : null}
                      {item.description ? <Text style={styles.previewText}>{item.description}</Text> : null}
                    </View>
                  ))}
                  {section.items.length === 0 && (
                    <Text style={styles.previewEmpty}>(Chưa có nội dung)</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {step !== 'template' && (
          <Button title="Quay lại" variant="outline" onPress={goBack} style={{ flex: 1, marginRight: SPACING.sm }} />
        )}
        {step === 'preview' ? (
          <Button title="Lưu CV" onPress={handleSave} isLoading={saving} style={{ flex: 2 }} />
        ) : (
          <Button title="Tiếp theo" onPress={goNext} disabled={!canGoNext()} style={{ flex: step === 'template' ? 1 : 2 }} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  progressBar: {
    flexDirection: 'row', justifyContent: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100],
  },
  progressStep: { alignItems: 'center', flex: 1 },
  progressDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.gray[200], justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  progressDotActive: { backgroundColor: COLORS.primary },
  progressDotText: { fontSize: 12, fontWeight: '700', color: COLORS.text.light },
  progressDotTextActive: { color: COLORS.white },
  progressLabel: { ...TYPOGRAPHY.caption, color: COLORS.text.light },
  progressLabelActive: { color: COLORS.primary, fontWeight: '600' },
  content: { flex: 1 },
  stepContent: { padding: SPACING.lg },
  stepTitle: { ...TYPOGRAPHY.h2, color: COLORS.text.primary, marginBottom: 4 },
  stepSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, marginBottom: SPACING.xl },
  // Templates
  existingSection: { marginBottom: SPACING.xl },
  existingLabel: { ...TYPOGRAPHY.label, color: COLORS.text.primary, marginBottom: SPACING.sm },
  existingCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray[50],
    borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm,
  },
  existingColor: { width: 40, height: 40, borderRadius: 8, marginRight: SPACING.md },
  existingInfo: { flex: 1 },
  existingTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text.primary },
  existingDate: { ...TYPOGRAPHY.caption, color: COLORS.text.secondary },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  templateCard: {
    width: '47%', backgroundColor: COLORS.white, borderRadius: 16,
    padding: SPACING.md, borderWidth: 2, borderColor: COLORS.gray[200],
    position: 'relative',
  },
  templateCardSelected: { borderColor: COLORS.primary },
  templatePreview: {
    height: 80, borderRadius: 8, marginBottom: SPACING.sm,
    padding: SPACING.sm, justifyContent: 'space-around',
  },
  templateLine: { height: 4, borderRadius: 2, width: '100%' },
  templateLineShort: { width: '60%' },
  templateName: { ...TYPOGRAPHY.body1, fontWeight: '700', color: COLORS.text.primary, marginBottom: 2 },
  templateDesc: { ...TYPOGRAPHY.caption, color: COLORS.text.secondary, marginBottom: SPACING.sm },
  colorRow: { flexDirection: 'row', gap: 6 },
  colorDot: { width: 18, height: 18, borderRadius: 9 },
  colorDotSelected: { borderWidth: 3, borderColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, elevation: 2 },
  selectedBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  selectedBadgeText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  // Sections
  addSectionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.xl },
  addSectionChip: {
    backgroundColor: COLORS.primary + '15', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary + '30',
  },
  addSectionChipDisabled: { backgroundColor: COLORS.gray[100], borderColor: COLORS.gray[200] },
  addSectionText: { ...TYPOGRAPHY.caption, fontWeight: '600', color: COLORS.primary },
  addSectionTextDisabled: { color: COLORS.text.light },
  sectionEditor: {
    backgroundColor: COLORS.background.secondary, borderRadius: 16,
    padding: SPACING.lg, marginBottom: SPACING.lg,
  },
  sectionEditorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionEditorTitle: { ...TYPOGRAPHY.h4, color: COLORS.text.primary },
  removeBtn: { ...TYPOGRAPHY.body2, color: COLORS.error, fontWeight: '600' },
  itemEditor: {
    backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm,
  },
  itemLabel: { ...TYPOGRAPHY.captionBold, color: COLORS.primary, marginBottom: SPACING.sm },
  dateRow: { flexDirection: 'row' },
  addItemBtn: {
    borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed',
    borderRadius: 12, padding: SPACING.md, alignItems: 'center',
  },
  addItemText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  emptySections: { alignItems: 'center', paddingVertical: 60 },
  emptySectionsText: { ...TYPOGRAPHY.body2, color: COLORS.text.light },
  // Preview
  previewCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
  },
  previewName: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  previewContact: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, marginBottom: 2 },
  previewSection: { marginTop: SPACING.xl, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.gray[100] },
  previewSectionTitle: { fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.sm },
  previewText: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, lineHeight: 22 },
  previewItem: { marginBottom: SPACING.md },
  previewItemTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text.primary },
  previewItemSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.text.secondary, fontStyle: 'italic' },
  previewItemDate: { ...TYPOGRAPHY.caption, color: COLORS.text.light, marginTop: 2 },
  previewEmpty: { ...TYPOGRAPHY.caption, color: COLORS.text.light, fontStyle: 'italic' },
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', padding: SPACING.lg,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'web' ? SPACING.lg : 30,
  },
});
