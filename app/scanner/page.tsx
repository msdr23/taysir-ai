'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- تمت إضافة استيراد الفوتر

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage(base64String);
        setAnalysisResult(null);
        setError('');
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('يرجى اختيار صورة أولاً');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setProgress(0);
    setSaved(false);

    // محاكاة مراحل التحليل
    const stages = [
      { progress: 15, message: '📤 جاري رفع الصورة...' },
      { progress: 35, message: '🔍 تحليل النص المكتوب...' },
      { progress: 55, message: '🧠 اكتشاف أنماط الأخطاء...' },
      { progress: 75, message: '📊 تصنيف الأخطاء حسب نوع الدسلكسيا...' },
      { progress: 90, message: '💡 إعداد التوصيات العلاجية...' },
      { progress: 100, message: '✅ اكتمل التحليل!' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setProgress(stage.progress);
      setProgressMessage(stage.message);
    }

    // نتائج محاكاة واقعية للدسلكسيا
    const mockResults = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      extracted_text: 'كتب الولد الدرس في الكراسة. كان الولد سعيد جداً. ذهب الولد الي المدرسة في الصباح.',
      accuracy: 78,
      word_count: 18,
      error_count: 4,
      dyslexia_indicators: ['قلب الحروف', 'حذف النقاط', 'إضافة حروف زائدة'],
      errors: [
        {
          word: 'الولد',
          correct: 'استخدام مرادف',
          type: 'تكرار',
          description: 'تكرار كلمة "الولد" ثلاث مرات - يُنصح باستخدام المرادفات',
          severity: 'منخفض'
        },
        {
          word: 'سعيد جداً',
          correct: 'سعيدٌ جداً',
          type: 'تنوين',
          description: 'نسيان التنوين في نهاية الكلمة',
          severity: 'متوسط'
        },
        {
          word: 'الي',
          correct: 'إلى',
          type: 'همزة',
          description: 'حذف همزة القطع في بداية الكلمة',
          severity: 'عالي'
        },
        {
          word: 'الكراسة',
          correct: 'الكراسة',
          type: 'تاء مربوطة',
          description: 'خطأ شائع في كتابة التاء المربوطة',
          severity: 'متوسط'
        }
      ],
      recommendations: [
        'التركيز على تمارين الهمزات (قطعة ووصل) لمدة 15 دقيقة يومياً',
        'تمارين التمييز بين التاء المربوطة والمفتوحة',
        'تدريب على استخدام التنوين في نهاية الكلمات',
        'تشجيع استخدام المرادفات لتجنب التكرار',
        'القراءة الجهرية لمدة 20 دقيقة يومياً لتحسين الطلاقة'
      ],
      next_steps: [
        'تمارين الهمزة - مستوى مبتدئ',
        'لعبة التاء المربوطة',
        'قصة قصيرة مع أسئلة فهم'
      ]
    };

    setAnalysisResult(mockResults);
    setIsAnalyzing(false);

    // حفظ النتائج في localStorage للداشبورد
    const savedResults = JSON.parse(localStorage.getItem('taysir_scan_results') || '[]');
    savedResults.push({
      id: mockResults.id,
      date: mockResults.date,
      accuracy: mockResults.accuracy,
      errors: mockResults.error_count,
      words: mockResults.word_count,
      text: mockResults.extracted_text,
      indicators: mockResults.dyslexia_indicators
    });
    localStorage.setItem('taysir_scan_results', JSON.stringify(savedResults));

    // تحديث إحصائيات الداشبورد
    const stats = JSON.parse(localStorage.getItem('taysir_dashboard_stats') || '{}');
    stats.totalScans = (stats.totalScans || 0) + 1;
    stats.totalExercises = (stats.totalExercises || 0) + mockResults.error_count;
    stats.lastScanDate = mockResults.date;
    stats.averageAccuracy = Math.round(
      ((stats.averageAccuracy || 0) * (stats.totalScans - 1) + mockResults.accuracy) / stats.totalScans
    );
    localStorage.setItem('taysir_dashboard_stats', JSON.stringify(stats));
  };

  const saveReport = () => {
    if (!analysisResult) return;
    
    const reports = JSON.parse(localStorage.getItem('taysir_reports') || '[]');
    reports.push({
      id: analysisResult.id,
      date: analysisResult.date,
      accuracy: analysisResult.accuracy,
      errors: analysisResult.errors
    });
    localStorage.setItem('taysir_reports', JSON.stringify(reports));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300" dir="rtl">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-[#1E88E5] dark:text-[#42A5F5]">
            📸 الماسح الذكي
          </h1>
          <p className="text-xl text-[#2C3E50] dark:text-gray-300">
            ارفع صورة ورقة الكتابة ودع الذكاء الاصطناعي يحلل الأخطاء
          </p>
        </div>

        {/* منطقة رفع الصورة */}
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#2C3E50] dark:text-white">
            📤 ارفع صورة ورقة الكتابة
          </h2>

          <div className="border-4 border-dashed border-[#1E88E5] rounded-2xl p-12 text-center hover:bg-[#1E88E5]/5 transition-all">
            {selectedImage ? (
              <div>
                <img
                  src={`data:image/jpeg;base64,${selectedImage}`}
                  alt="الصورة المرفوعة"
                  className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                  }}
                  className="mt-4 bg-[#E53935] text-white px-6 py-2 rounded-full font-bold hover:bg-[#C62828]"
                >
                  🗑️ إزالة الصورة
                </button>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">📷</div>
                <p className="text-xl text-[#2C3E50] dark:text-gray-300 mb-4">
                  اضغط لاختيار صورة أو اسحبها هنا
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block bg-[#1E88E5] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-[#1565C0] cursor-pointer"
                >
                   اختيار صورة
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-[#E53935]/10 border-2 border-[#E53935] rounded-xl p-4 text-[#E53935] font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={analyzeImage}
            disabled={!selectedImage || isAnalyzing}
            className="w-full mt-6 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white py-4 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-lg">{progressMessage}</span>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              '🧠 ابدأ التحليل الذكي'
            )}
          </button>
        </div>

        {/* عرض النتائج */}
        {analysisResult && (
          <div className="space-y-6">
            {/* ملخص عام */}
            <div className="bg-gradient-to-r from-[#1E88E5] to-[#43A047] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-3xl font-black">📊 ملخص التحليل</h2>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  📅 {analysisResult.date}
                </span>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black mb-2">{analysisResult.accuracy}%</div>
                  <div className="text-lg opacity-90">دقة الكتابة</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black mb-2">{analysisResult.word_count}</div>
                  <div className="text-lg opacity-90">عدد الكلمات</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black mb-2">{analysisResult.error_count}</div>
                  <div className="text-lg opacity-90">أخطاء مكتشفة</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black mb-2">3</div>
                  <div className="text-lg opacity-90">مؤشرات دسلكسيا</div>
                </div>
              </div>
            </div>

            {/* النص المستخرج */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-black mb-4 text-[#1E88E5]">📝 النص المستخرج</h3>
              <div className="bg-[#FDF6E3] dark:bg-[#0f0f1e] p-6 rounded-2xl">
                <p className="text-xl text-[#2C3E50] dark:text-gray-300 leading-loose">
                  {analysisResult.extracted_text}
                </p>
              </div>
            </div>

            {/* مؤشرات الدسلكسيا */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-black mb-4 text-[#8E24AA]">🔍 مؤشرات الدسلكسيا المكتشفة</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {analysisResult.dyslexia_indicators.map((indicator: string, index: number) => (
                  <div key={index} className="bg-[#8E24AA]/10 border-r-4 border-[#8E24AA] p-4 rounded-xl">
                    <div className="text-lg font-bold text-[#2C3E50] dark:text-white">
                      {indicator}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الأخطاء التفصيلية */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-black mb-6 text-[#E53935]">
                ⚠️ الأخطاء المكتشفة ({analysisResult.errors.length})
              </h3>
              <div className="space-y-4">
                {analysisResult.errors.map((error: any, index: number) => (
                  <div
                    key={index}
                    className={`border-r-4 p-6 rounded-xl ${
                      error.severity === 'عالي' 
                        ? 'bg-[#E53935]/10 border-[#E53935]' 
                        : error.severity === 'متوسط'
                        ? 'bg-[#FFB300]/10 border-[#FFB300]'
                        : 'bg-[#43A047]/10 border-[#43A047]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div className="flex-1">
                        <span className="text-lg font-bold text-[#2C3E50] dark:text-white">
                          الكلمة: {error.word}
                        </span>
                        <span className="mr-4 text-[#43A047] font-bold">
                          ✅ التصحيح: {error.correct}
                        </span>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        error.severity === 'عالي' 
                          ? 'bg-[#E53935] text-white' 
                          : error.severity === 'متوسط'
                          ? 'bg-[#FFB300] text-white'
                          : 'bg-[#43A047] text-white'
                      }`}>
                        {error.severity}
                      </span>
                    </div>
                    <div className="text-[#2C3E50] dark:text-gray-300 mb-2">
                      <span className="font-bold">النوع:</span> {error.type}
                    </div>
                    <div className="text-[#2C3E50]/80 dark:text-gray-400">
                      {error.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* التوصيات العلاجية */}
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-black mb-6 text-[#43A047]">
                💡 التوصيات العلاجية المخصصة
              </h3>
              <div className="space-y-3">
                {analysisResult.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="bg-[#43A047]/10 border-r-4 border-[#43A047] p-4 rounded-xl flex items-start gap-3"
                  >
                    <span className="text-2xl">✓</span>
                    <span className="text-lg text-[#2C3E50] dark:text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* الخطوات التالية */}
            <div className="bg-gradient-to-r from-[#8E24AA] to-[#1E88E5] rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-black mb-6">🎯 الخطوات التالية المقترحة</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {analysisResult.next_steps.map((step: string, index: number) => (
                  <Link
                    key={index}
                    href="/exercises"
                    className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/30 transition-all cursor-pointer"
                  >
                    <div className="text-4xl mb-3">
                      {index === 0 ? '✍️' : index === 1 ? '🎮' : '📖'}
                    </div>
                    <div className="font-bold">{step}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/exercises"
                className="flex-1 bg-[#43A047] text-white py-4 rounded-2xl text-xl font-bold hover:bg-[#2E7D32] transition-all text-center"
              >
                 ابدأ التمارين المخصصة
              </Link>
              <button
                onClick={saveReport}
                className={`flex-1 py-4 rounded-2xl text-xl font-bold transition-all ${
                  saved 
                    ? 'bg-[#43A047] text-white' 
                    : 'bg-[#FFB300] text-white hover:bg-[#FFA000]'
                }`}
              >
                {saved ? '✅ تم الحفظ في لوحة التحكم!' : '💾 حفظ التقرير'}
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setAnalysisResult(null);
                }}
                className="flex-1 bg-[#1E88E5] text-white py-4 rounded-2xl text-xl font-bold hover:bg-[#1565C0] transition-all"
              >
                📸 تحليل صورة جديدة
              </button>
            </div>

            {/* رسالة تأكيد الربط بالداشبورد */}
            <div className="bg-[#1E88E5]/10 border-2 border-[#1E88E5] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🔗</div>
              <p className="text-lg font-bold text-[#1E88E5]">
                تم حفظ النتائج تلقائياً في لوحة التحكم!
              </p>
              <Link 
                href="/dashboard" 
                className="inline-block mt-3 text-[#1E88E5] font-bold hover:underline"
              >
                👉 عرض لوحة التحكم
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* <-- تم إضافة الفوتر الاحترافي هنا --> */}
      <Footer />
    </div>
  );
}