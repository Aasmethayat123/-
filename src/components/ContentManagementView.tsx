import React, { useState } from 'react';
import { Language, ProjectItem, GameMode } from '../types';
import { 
  getStoredProjects, 
  saveStoredProjects, 
  addStoredProject, 
  updateStoredProject, 
  deleteStoredProject, 
  resetProjectsToDefault 
} from '../utils/projectsStore';
import { soundManager } from '../utils/audio';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Save,
  X,
  Download
} from 'lucide-react';
import { downloadDistZip } from '../utils/downloadPackage';

interface ContentManagementViewProps {
  language: Language;
  onNavigateMode: (mode: GameMode) => void;
}

export const ContentManagementView: React.FC<ContentManagementViewProps> = ({
  language,
  onNavigateMode
}) => {
  const isAr = language === 'ar';
  const [projects, setProjects] = useState<ProjectItem[]>(() => getStoredProjects());
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'psychology-games' as ProjectItem['category'],
    status: 'active' as ProjectItem['status'],
    icon: '📦',
    realUrl: '',
    featuresText: '',
    content: '',
    isPublished: true
  });

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const startEdit = (proj: ProjectItem) => {
    soundManager.playSoftTap();
    setEditingProjectId(proj.id);
    setIsAddingNew(false);
    setFormData({
      name: proj.name,
      description: proj.description,
      category: proj.category,
      status: proj.status,
      icon: proj.icon || '📦',
      realUrl: proj.realUrl || '',
      featuresText: (proj.features || []).join('\n'),
      content: proj.content || '',
      isPublished: proj.isPublished
    });
  };

  const startAddNew = () => {
    soundManager.playSoftTap();
    setIsAddingNew(true);
    setEditingProjectId(null);
    setFormData({
      name: '',
      description: '',
      category: 'initiatives',
      status: 'in-development',
      icon: '✨',
      realUrl: '',
      featuresText: '',
      content: '',
      isPublished: false // By default unpublished until real data is entered
    });
  };

  const cancelForm = () => {
    setEditingProjectId(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification(isAr ? 'يرجى إدخال اسم المشروع الحقيقي' : 'Please enter the project name');
      return;
    }

    const featuresArray = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (isAddingNew) {
      const created = addStoredProject({
        name: formData.name.trim(),
        description: formData.description.trim() || (isAr ? 'سيتم إضافة المحتوى قريباً' : 'Content coming soon'),
        category: formData.category,
        status: formData.status,
        icon: formData.icon.trim() || '📦',
        realUrl: formData.realUrl.trim(),
        features: featuresArray,
        content: formData.content.trim(),
        isPublished: formData.isPublished
      });

      setProjects(getStoredProjects());
      soundManager.playHarmonicAffirmation();
      showNotification(isAr ? 'تم إضافة المشروع بنجاح' : 'Project added successfully');
      cancelForm();
    } else if (editingProjectId) {
      const updated = updateStoredProject(editingProjectId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        icon: formData.icon.trim(),
        realUrl: formData.realUrl.trim(),
        features: featuresArray,
        content: formData.content.trim(),
        isPublished: formData.isPublished
      });

      setProjects(updated);
      soundManager.playHarmonicAffirmation();
      showNotification(isAr ? 'تم تحديث بيانات المشروع بنجاح' : 'Project updated successfully');
      cancelForm();
    }
  };

  const togglePublish = (proj: ProjectItem) => {
    soundManager.playSoftTap();
    const updated = updateStoredProject(proj.id, { isPublished: !proj.isPublished });
    setProjects(updated);
    showNotification(
      !proj.isPublished
        ? (isAr ? `تم نشر "${proj.name}" في الواجهة` : `Published "${proj.name}"`)
        : (isAr ? `تم تحويل "${proj.name}" إلى مسودة` : `Set "${proj.name}" to draft`)
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'nesma-hayat' || id === 'abaqirat-oyoun-misr') {
      showNotification(isAr ? 'هذا مشروع أساسي لا يمكن حذفه' : 'Cannot delete core project');
      return;
    }

    soundManager.playSoftTap();
    const updated = deleteStoredProject(id);
    setProjects(updated);
    showNotification(isAr ? `تم حذف المشروع "${name}"` : `Deleted project "${name}"`);
  };

  const handleResetDefaults = () => {
    soundManager.playSoftTap();
    const res = resetProjectsToDefault();
    setProjects(res);
    cancelForm();
    showNotification(isAr ? 'تمت استعادة المشروعات المعتمدة الأساسية' : 'Restored default verified projects');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isAr ? 'إدارة المحتوى والمشروعات' : 'Content Management CMS'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isAr ? 'إدارة البيانات والمشروعات الحقيقية' : 'Manage Authentic Projects'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            {isAr
              ? 'إضافة وتعديل بيانات المشروعات والألعاب والاختراعات الحقيقية فقط.'
              : 'Add and maintain real projects, games, and verified content.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={async () => {
              soundManager.playSoftTap();
              const ok = await downloadDistZip();
              if (ok) {
                showNotification(isAr ? 'بدأ تنزيل ملف fakkerfeha-dist.zip بنجاح' : 'Download started');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
            title={isAr ? 'تنزيل حزمة النشر fakkerfeha-dist.zip' : 'Download ZIP'}
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تنزيل حزمة النشر (ZIP)' : 'Download ZIP'}</span>
          </button>

          <button
            onClick={() => onNavigateMode('projects')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {isAr ? '← عرض المشروعات' : '← View Projects'}
          </button>
          <button
            onClick={startAddNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'إضافة مشروع حقيقي' : 'Add Project'}</span>
          </button>
        </div>
      </div>

      {/* Strict Guidelines Reminder */}
      <div className="p-5 bg-amber-500/10 border-2 border-amber-400/60 rounded-3xl space-y-2 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-extrabold text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{isAr ? 'تنبيه إلزامي حول البيانات والمحتوى:' : 'Mandatory Integrity Rule:'}</span>
        </div>
        <p className="leading-relaxed text-stone-700">
          {isAr
            ? 'يمنع اختراع أسماء مشروعات وهمية أو روابط أو أرقام أو إحصائيات أو تقييمات لم يقدمها صاحب المشروع. لا تضع روابط غير موجودة، وإذا لم يتوفر الرابط سيظهر تلقائياً «الرابط سيتم إضافته لاحقاً». ولا يُعتبر أي مشروع منشوراً إلا بعد اعتماد بياناته.'
            : 'Never invent fake metrics, statistics, URLs, or projects. Missing links will display "Link will be added soon" without broken URLs.'}
        </p>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Edit / Add Form */}
      {(isAddingNew || editingProjectId) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-lg font-extrabold text-stone-900 font-serif">
              {isAddingNew
                ? (isAr ? 'إضافة مشروع / لعبة / اختراع حقيقي جديد' : 'Add New Real Project')
                : (isAr ? 'تعديل بيانات المشروع الحقيقي' : 'Edit Project Data')}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'اسم المشروع الحقيقي *' : 'Real Project Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isAr ? 'مثال: نسمة حياة / عباقرة عيون مصر' : 'Project name'}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900 cursor-pointer"
              >
                <option value="psychology-games">{isAr ? 'ألعاب نفسية وتطبيقية' : 'Psychology Games'}</option>
                <option value="initiatives">{isAr ? 'مبادرات ومشروعات' : 'Initiatives'}</option>
                <option value="apps">{isAr ? 'تطبيقات' : 'Applications'}</option>
                <option value="inventions">{isAr ? 'اختراعات وابتكارات' : 'Inventions'}</option>
                <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'حالة المشروع' : 'Status'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900 cursor-pointer"
              >
                <option value="active">{isAr ? 'نشط ومتاح' : 'Active'}</option>
                <option value="in-development">{isAr ? 'قيد التطوير والتحديث' : 'In Development'}</option>
                <option value="upcoming">{isAr ? 'مشروع قادم' : 'Upcoming'}</option>
              </select>
            </div>

            {/* Icon / Design Symbol */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                {isAr ? 'رمز توضيحي للتصميم (إيموجي)' : 'Design Icon Symbol'}
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🌿, 👁️, 💡"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900"
              />
            </div>
          </div>

          {/* Real URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'الرابط الحقيقي للمشروع (اتركه فارغاً إذا لم يتوفر بعد ليظهر «الرابط سيتم إضافته لاحقاً»)' : 'Real URL (leave empty if not available yet)'}
            </label>
            <input
              type="url"
              value={formData.realUrl}
              onChange={(e) => setFormData({ ...formData, realUrl: e.target.value })}
              placeholder="https://..."
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'الوصف الفعلي الحقيقي للمشروع' : 'Real Description'}
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isAr ? 'اكتب الوصف المعتمد بدون تخمين...' : 'Enter approved description...'}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900"
            />
          </div>

          {/* Features (one per line) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 block">
              {isAr ? 'المحاور والمميزات الحقيقية (اكتب كل ميزة في سطر منفصل)' : 'Features / Axes (one per line)'}
            </label>
            <textarea
              rows={3}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder={isAr ? 'الميزة الأولى\nالميزة الثانية...' : 'Feature 1\nFeature 2...'}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-stone-900 font-mono"
            />
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-stone-800 cursor-pointer select-none">
              {isAr ? 'نشر هذا المشروع في الواجهة العامة للزوار' : 'Publish this project on the public showcase'}
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ البيانات المعتمدة' : 'Save Verified Data'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List in CMS */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-base font-extrabold text-stone-900 font-serif">
            {isAr ? 'قائمة المشروعات المسجلة' : 'Registered Projects List'}
          </h2>
          <span className="text-xs text-stone-500 font-mono font-bold">
            {projects.length} {isAr ? 'مشروعات' : 'projects'}
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {projects.map((proj) => {
            const isCore = proj.id === 'nesma-hayat' || proj.id === 'abaqirat-oyoun-misr';

            return (
              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{proj.icon || '📦'}</span>
                    <h4 className="text-sm font-extrabold text-stone-900 font-serif">
                      {proj.name}
                    </h4>
                    {isCore && (
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-bold">
                        {isAr ? 'مشروع أساسي' : 'Core'}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      proj.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {proj.isPublished ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 max-w-xl">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => togglePublish(proj)}
                    className="p-2 hover:bg-stone-100 text-stone-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    title={proj.isPublished ? (isAr ? 'إخفاء من العامة' : 'Unpublish') : (isAr ? 'نشر للعامة' : 'Publish')}
                  >
                    {proj.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
                  </button>

                  <button
                    onClick={() => startEdit(proj)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تعديل' : 'Edit'}</span>
                  </button>

                  {!isCore && (
                    <button
                      onClick={() => handleDelete(proj.id, proj.name)}
                      className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl cursor-pointer transition-colors"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Defaults button */}
        <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
          <span className="text-stone-400">
            {isAr ? 'البيانات تُحفظ في الذاكرة المحلية لجهازك' : 'Data is stored locally in your browser'}
          </span>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة المشروعات المعتمدة الأولية' : 'Reset to verified defaults'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
