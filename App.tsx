
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { FormData, FormErrors } from './types';
import { MEETING_TYPES, LOCATIONS, SUPERVISORS, GIFT_TYPES, WHATSAPP_NUMBER } from './constants';
import InputField from './components/InputField';
import SelectField from './components/SelectField';

declare const html2canvas: any;

const initialState: FormData = {
  date: '',
  venueName: '',
  meetingType: '',
  location: '',
  supervisor: '',
  tollFreeNumber: '',
  pidiliteTeamMembers: '',
  totalAttendees: '',
  registeredInPortal: '',
  giftsProvided: '',
  giftsByCMDI: '',
  remainingGiftType: '',
  remainingGifts: '',
  remainingBags: '',
  remainingMaterials: '',
  comments: '',
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
        return `${day}-${month}-${year}`;
    }
    return dateString;
};

const ReportDataCell: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="flex flex-col">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value?.trim() || 'N/A'}</p>
    </div>
);

// --- Report Image Template Component ---
const ReportImageTemplate: React.FC<{ formData: FormData, fRef: React.Ref<HTMLDivElement> }> = ({ formData, fRef }) => (
  <div ref={fRef} className="bg-gray-100" style={{ width: '850px', fontFamily: 'Inter, sans-serif' }}>
    <div className="bg-white shadow-lg p-10">
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 rounded-t-lg -m-10 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">REPORT CARD</h1>
        <div className="flex justify-between items-baseline mt-2">
          <p className="text-2xl font-light">{formData.venueName}</p>
          <p className="text-xl text-blue-200">{formatDate(formData.date)}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* Section: Event Details */}
        <section>
          <h2 className="text-lg font-bold text-blue-800 pb-2 mb-3 border-b-2 border-blue-100">Event Details</h2>
          <div className="grid grid-cols-3 gap-6">
            <ReportDataCell label="Meeting Type" value={formData.meetingType} />
            <ReportDataCell label="Location" value={formData.location} />
            <ReportDataCell label="Supervisor" value={formData.supervisor} />
            <ReportDataCell label="Toll-Free Number" value={formData.tollFreeNumber} />
            <ReportDataCell label="Pidilite Team Present" value={formData.pidiliteTeamMembers} />
          </div>
        </section>

        {/* Section: Attendance & Distribution */}
        <section>
          <h2 className="text-lg font-bold text-blue-800 pb-2 mb-3 border-b-2 border-blue-100">Attendance & Distribution</h2>
          <div className="grid grid-cols-4 gap-6">
            <ReportDataCell label="Total Attendees" value={formData.totalAttendees} />
            <ReportDataCell label="Registered in Portal" value={formData.registeredInPortal} />
            <ReportDataCell label="Gifts Provided" value={formData.giftsProvided} />
            <ReportDataCell label="Gifts to CMDI" value={formData.giftsByCMDI} />
          </div>
        </section>

        {/* Section: Inventory */}
        <section>
          <h2 className="text-lg font-bold text-blue-800 pb-2 mb-3 border-b-2 border-blue-100">Inventory</h2>
          <div className="grid grid-cols-4 gap-6">
            <ReportDataCell label="Remaining Gift Type" value={formData.remainingGiftType} />
            <ReportDataCell label="Remaining Gifts" value={formData.remainingGifts} />
            <ReportDataCell label="Remaining Bags" value={formData.remainingBags} />
            <ReportDataCell label="Remaining Material" value={formData.remainingMaterials} />
          </div>
        </section>
        
        {/* Section: Comments */}
        {formData.comments.trim() && (
          <section>
            <h2 className="text-lg font-bold text-blue-800 pb-2 mb-3 border-b-2 border-blue-100">Comments</h2>
            <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-md">{formData.comments}</p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs mt-8 pt-4 border-t border-gray-200">
        &copy; 2025 AtoZ Event Management services and Gaurik Brand Solutions. All rights reserved.
      </footer>
    </div>
  </div>
);

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: { border: 'border-blue-500', text: 'text-blue-800' },
  green: { border: 'border-green-500', text: 'text-green-800' },
  purple: { border: 'border-purple-500', text: 'text-purple-800' },
  orange: { border: 'border-orange-500', text: 'text-orange-800' },
};

const FormSection: React.FC<FormSectionProps> = ({ title, children, color }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md">
        <h2 className={`text-xl font-bold ${colorClasses[color].text} mb-6 border-b-2 ${colorClasses[color].border} pb-3`}>{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const Loader: React.FC = () => (
    <div className="flex justify-center items-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
    </div>
);


const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if(errors[name as keyof FormData]){
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[name as keyof FormData];
            return newErrors;
        })
    }
  }, [errors]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.venueName.trim()) newErrors.venueName = 'Hall name is required.';
    if (!formData.meetingType) newErrors.meetingType = 'Meeting type is required.';
    if (!formData.location) newErrors.location = 'Location is required.';
    if (!formData.supervisor) newErrors.supervisor = 'Supervisor is required.';
    if (!formData.tollFreeNumber.trim()) newErrors.tollFreeNumber = 'Toll free number is required.';
    if (!formData.pidiliteTeamMembers.trim()) newErrors.pidiliteTeamMembers = 'This field is required.';
    if (!formData.totalAttendees.trim()) newErrors.totalAttendees = 'This field is required.';
    if (!formData.registeredInPortal.trim()) newErrors.registeredInPortal = 'This field is required.';
    if (!formData.giftsProvided.trim()) newErrors.giftsProvided = 'This field is required.';
    if (!formData.remainingGiftType) newErrors.remainingGiftType = 'Please select a remaining gift type.';
    if (!formData.remainingGifts.trim()) newErrors.remainingGifts = 'This field is required.';
    if (!formData.remainingBags.trim()) newErrors.remainingBags = 'This field is required.';
    if (!formData.remainingMaterials.trim()) newErrors.remainingMaterials = 'This field is required.';
    return newErrors;
  };

  const downloadAndOpenWhatsAppWeb = (imageDataUrl: string, message: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const whatsappUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    alert('Report card image downloaded. Please attach it to the WhatsApp chat that has opened in a new tab.');
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    if (!reportRef.current) {
        alert("Report card component is not ready. Please try again.");
        return;
    }

    setIsSubmitting(true);

    try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const message = `*Pidilite Report Card*\n\nDate: ${formatDate(formData.date)}\nVenue: ${formData.venueName}\nLocation: ${formData.location}\nSupervisor: ${formData.supervisor}`;
        const fileName = `pidilite_report_card_${formData.date}.png`;

        if (navigator.share && typeof canvas.toBlob === 'function') {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert("Could not create image blob. Using fallback method.");
                    downloadAndOpenWhatsAppWeb(canvas.toDataURL('image/png'), message, fileName);
                    return;
                }
                const file = new File([blob], fileName, { type: 'image/png' });
                const shareData = {
                    files: [file],
                    title: 'Pidilite Report Card',
                    text: message,
                };

                if (navigator.canShare && navigator.canShare(shareData)) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        console.log("Share was cancelled or failed", err);
                    } finally {
                        setIsSubmitting(false);
                    }
                } else {
                    downloadAndOpenWhatsAppWeb(canvas.toDataURL('image/png'), message, fileName);
                }
            }, 'image/png');
        } else {
            downloadAndOpenWhatsAppWeb(canvas.toDataURL('image/png'), message, fileName);
        }
    } catch (error) {
        console.error("Error generating report card:", error);
        alert("There was an error generating the report card. Please check the console.");
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <ReportImageTemplate formData={formData} fRef={reportRef} />
      </div>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">Pidilite Report Card</h1>
            <p className="mt-2 text-lg text-gray-600">Fill out the details below to generate and send the report card.</p>
          </header>
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <FormSection title="Event Details" color="blue">
                <InputField id="date" name="date" label="Date" type="date" value={formData.date} onChange={handleChange} error={errors.date} required />
                <InputField id="venueName" name="venueName" label="Hall name" value={formData.venueName} onChange={handleChange} error={errors.venueName} required placeholder="Enter hall name" />
                <SelectField id="meetingType" name="meetingType" label="Meeting Type" value={formData.meetingType} onChange={handleChange} options={MEETING_TYPES} error={errors.meetingType} required />
                <SelectField id="location" name="location" label="Location" value={formData.location} onChange={handleChange} options={LOCATIONS} error={errors.location} required />
                <SelectField id="supervisor" name="supervisor" label="Supervisor" value={formData.supervisor} onChange={handleChange} options={SUPERVISORS} error={errors.supervisor} required />
                <InputField id="tollFreeNumber" name="tollFreeNumber" label="Toll Free Number" type="tel" value={formData.tollFreeNumber} onChange={handleChange} error={errors.tollFreeNumber} required placeholder="e.g., 1800-000-0000" />
                <div className="md:col-span-2">
                  <InputField id="pidiliteTeamMembers" name="pidiliteTeamMembers" label="Pidilite Team Members Present" type="number" value={formData.pidiliteTeamMembers} onChange={handleChange} error={errors.pidiliteTeamMembers} required placeholder="e.g., 3" />
                </div>
            </FormSection>

            <FormSection title="Attendees & Gifts" color="green">
                <InputField id="totalAttendees" name="totalAttendees" label="Total Attendees" type="number" value={formData.totalAttendees} onChange={handleChange} error={errors.totalAttendees} required placeholder="e.g., 50" />
                <InputField id="registeredInPortal" name="registeredInPortal" label="Registered in Portal" type="number" value={formData.registeredInPortal} onChange={handleChange} error={errors.registeredInPortal} required placeholder="e.g., 45" />
                <InputField id="giftsProvided" name="giftsProvided" label="No. of Gifts Provided to attendees" type="number" value={formData.giftsProvided} onChange={handleChange} error={errors.giftsProvided} required placeholder="e.g., 50" />
                <InputField id="giftsByCMDI" name="giftsByCMDI" label="No. of Gifts Provided to CMDI (if any)" type="number" value={formData.giftsByCMDI} onChange={handleChange} error={errors.giftsByCMDI} placeholder="e.g., 2" />
            </FormSection>

            <FormSection title="Inventory Management" color="purple">
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remaining Gift Type
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center space-x-6 mt-2">
                    {GIFT_TYPES.map((giftType) => (
                      <div key={giftType} className="flex items-center">
                        <input
                          id={giftType}
                          name="remainingGiftType"
                          type="radio"
                          value={giftType}
                          checked={formData.remainingGiftType === giftType}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <label htmlFor={giftType} className="ml-2 block text-sm font-medium text-gray-700">
                          {giftType}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.remainingGiftType && <p className="mt-1 text-xs text-red-600">{errors.remainingGiftType}</p>}
                </div>
                
                <InputField id="remainingGifts" name="remainingGifts" label="Remaining Gifts" type="number" value={formData.remainingGifts} onChange={handleChange} error={errors.remainingGifts} required placeholder="e.g., 5" />
                <InputField id="remainingBags" name="remainingBags" label="Remaining Bags" type="number" value={formData.remainingBags} onChange={handleChange} error={errors.remainingBags} required placeholder="e.g., 5" />
                <div className="md:col-span-2">
                  <InputField id="remainingMaterials" name="remainingMaterials" label="Remaining Training Material" type="text" value={formData.remainingMaterials} onChange={handleChange} error={errors.remainingMaterials} required placeholder="e.g., Brochures, pamphlets" />
                </div>
            </FormSection>

            <FormSection title="Additional Comments" color="orange">
               <div className="md:col-span-2">
                  <textarea id="comments" name="comments" rows={4} value={formData.comments} onChange={handleChange} placeholder="Any additional comments or feedback." className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm text-gray-800 placeholder-gray-400" />
                </div>
            </FormSection>
            
            <div>
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:from-gray-400 transition-transform transform hover:scale-105">
                {isSubmitting ? 'Generating Report Card...' : 'Generate & Send Report Card'}
              </button>
            </div>
          </form>
          <footer className="text-center text-gray-600 text-sm mt-12">
             &copy; 2025 AtoZ Event Management services and Gaurik Brand Solutions. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;
