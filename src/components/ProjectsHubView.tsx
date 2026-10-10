import React, { useState, useEffect } from 'react';
import { Language, ProjectItem, GameMode } from '../types';
import { getStoredProjects } from '../utils/projectsStore';
import { soundManager } from '../utils/audio';
import { isAdminAuthenticated } from '../utils/adminAuth';
import { 
  FolderKanban, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Settings, 
  Layers, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface ProjectsHubViewProps {
  language: Language;
  onNavigateMode: (mode: GameMode) => void;
}

export const ProjectsHubView: React.FC<ProjectsHubViewProps> = ({
  language,
  onNavigateMode
}) => {
  const isAr = language === 'ar';
  const [projects, setProjects] = useState<ProjectItem[]>(() => getStoredProjects());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const publishedProjects = projects.filter(p => p.isPublished);

  const filteredProjects = selectedCategory === 'all'
    ? publishedProjects
    : publishedProjects.filter(p => p.category === selectedCategory);

  const getStatusBadge = (status: ProjectItem['status']) => {
    switch (status) {
      case 'active':
        return {
          label: isAr ? 'نشط ومتاح' : 'Active',
          classes: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'in-development':
        return {
          label: isAr ? 'قيد التطوير والتحديث' : 'In Development',
          classes: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'upcoming':
        return {
          label: isAr ? 'مشروع قادم' : 'Upcoming',
          classes: 'bg-stone-200 text-stone-700 border-stone-300'
        };
    }
  };

  const getCategoryLabel = (cat: ProjectItem['category']) => {
    switch (cat) {
      case 'psychology-games':
        return isAr ? 'ألعاب نفسية وتطبيقية' : 'Psychology Games';
      case 'initiatives':
        return isAr ? 'مبادرات ومشروعات' : 'Initiatives';
      case 'apps':
        return isAr ? 'تطبيقات برمجية' : 'Applications';
      case 'inventions':
        return isAr ? 'اختراعات وابتكارات' : 'Inventions';
      default:
        return isAr ? 'عام' : 'General';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isAr ? 'المشروعات الحقيقية المعتمدة' : 'Verified Real Projects'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {isAr ? 'المشروعات والمبادرات الخاصة بي' : 'My Authentic Projects & Initiatives'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl leading-relaxed">
            {isAr
              ? 'مساحة مخصصة لعرض المشروعات الحقيقية فقط دون أي إحصائيات وهمية أو معلومات غير معتمدة.'
              : 'Dedicated showcase of authentic projects only, without fabricated metrics or unverified data.'}
          </p>
        </div>

        {/* Action to Content Management (Restricted to Admin) */}
        {isAdminAuthenticated() && (
          <button
            onClick={() => {
              soundManager.playSoftTap();
              onNavigateMode('admin-cms');
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-2xl text-xs font-bold cursor-pointer transition-all border border-stone-700 shadow-sm shrink-0"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'لوحة إدارة المحتوى' : 'Content Management'}</span>
          </button>
        )}
      </div>

      {/* Transparency & Authenticity Notice */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold block">
            {isAr ? 'معيار البيانات الحقيقية والشفافية:' : 'Data Integrity Standard:'}
          </span>
          <p className="leading-relaxed text-emerald-900">
            {isAr
              ? 'جميع المشروعات المعروضة هنا مستندة حصراً إلى البيانات الحقيقية المعتمدة. الرموز والأيقونات المستخدمة هي عناصر تصميم توضيحية للواجهة وليست صوراً فوتوغرافية للمشروع.'
              : 'All projects displayed are strictly based on authentic approved information. Icons used are UI design elements, not project photographs.'}
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'all', label: isAr ? 'جميع المشروعات' : 'All Projects' },
          { id: 'psychology-games', label: isAr ? 'ألعاب نفسية' : 'Psychology Games' },
          { id: 'initiatives', label: isAr ? 'مبادرات' : 'Initiatives' },
          { id: 'inventions', label: isAr ? 'اختراعات وابتكارات' : 'Inventions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playSoftTap();
              setSelectedCategory(tab.id);
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Showcase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-stone-200 p-10 text-center space-y-2">
            <span className="text-3xl">📦</span>
            <h3 className="text-sm font-bold text-stone-700">
              {isAr ? 'لا توجد مشروعات منشورة في هذا التصنيف حالياً' : 'No published projects in this category'}
            </h3>
            <p className="text-xs text-stone-400">
              {isAr ? 'سيتم إضافة المشروعات المعتمدة فور اعتمادها من لوحة إدارة المحتوى' : 'Verified projects will appear here once published via CMS'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const statusInfo = getStatusBadge(project.status);

          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl border-2 border-stone-200 hover:border-emerald-500/50 transition-all p-6 sm:p-7 shadow-xs hover:shadow-md flex flex-col justify-between space-y-6"
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {project.icon || '📦'}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                        {getCategoryLabel(project.category)}
                      </span>
                      <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusInfo.classes}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  {project.description}
                </p>

                {/* Real Features List */}
                {project.features && project.features.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                      {isAr ? 'المحاور والمميزات الحقيقية:' : 'Core Features:'}
                    </span>
                    <ul className="space-y-1.5">
                      {project.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-xs text-stone-400 italic">
                      {isAr ? 'المحاور والمميزات: سيتم إضافتها قريباً من خلال إدارة المحتوى' : 'Features will be added soon'}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Real link or "الرابط سيتم إضافته لاحقاً" */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
                {project.id === 'nesma-hayat' ? (
                  <button
                    onClick={() => {
                      soundManager.playSoftTap();
                      onNavigateMode('map');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <span>{isAr ? 'فتح وتجربة ألعاب «فكر فيها»' : 'Explore Games'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                ) : (
                  <div className="text-xs text-stone-500 font-medium">
                    {project.status === 'in-development' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{isAr ? 'قيد التطوير والتجهيز' : 'In Preparation'}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Real URL badge or fallback */}
                {project.realUrl && project.realUrl.trim() !== '' ? (
                  <a
                    href={project.realUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    <span>{isAr ? 'زيارة الرابط الرسمي' : 'Official Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                    {isAr ? 'الرابط سيتم إضافته لاحقاً' : 'Link will be added soon'}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
