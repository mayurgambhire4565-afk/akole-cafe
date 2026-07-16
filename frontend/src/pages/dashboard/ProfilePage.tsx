import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Phone, Camera, Loader2, ShieldCheck, Languages } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useTranslation } from '@/store/languageStore';

type ProfileFormData = {
  name: string;
  email: string;
  phone?: string;
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  // Sync form values when user object becomes available (hydration)
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await api.put('/users/profile', data);
      return res.data.data.user;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success(language === 'en' ? 'Profile updated successfully' : 'प्रोफाइल यशस्वीरित्या जतन केली');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.data.user);
      toast.success(language === 'en' ? 'Avatar updated successfully' : 'प्रोफाइल फोटो बदलला');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 mb-2">
          ✦ {t('settings').toUpperCase()}
        </span>
        <h1 className="text-3xl font-display font-bold text-coffee-950 dark:text-cream-50">{t('profileSettings')}</h1>
        <p className="text-coffee-500 dark:text-coffee-400 text-sm">
          {language === 'en' ? 'Manage your personal information and contact details.' : 'तुमची वैयक्तिक माहिती आणि संपर्क तपशील व्यवस्थापित करा.'}
        </p>
      </div>

      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-coffee-900/40 dark:backdrop-blur-md rounded-3xl border border-coffee-100 dark:border-gold-500/10 shadow-sm overflow-hidden"
      >
        {/* Avatar Section */}
        <div className="p-8 border-b border-coffee-100 dark:border-gold-500/10 bg-gradient-to-r from-coffee-50/50 via-transparent to-transparent dark:from-coffee-950/20 dark:to-transparent flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gold-500/20 shadow-lg relative bg-coffee-50 dark:bg-coffee-950 flex items-center justify-center transition-transform group-hover:scale-102 duration-300">
              {isUploading ? (
                <div className="absolute inset-0 bg-coffee-950/40 flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                </div>
              ) : user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-coffee-400 dark:text-coffee-600" />
              )}
            </div>
            {/* Upload Overlay */}
            <label 
              htmlFor="avatar-input" 
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 z-20 text-xs font-semibold gap-1"
            >
              <Camera className="w-6 h-6 text-gold-400 animate-bounce-subtle" />
              <span>{language === 'en' ? 'Change Photo' : 'फोटो बदला'}</span>
            </label>
            {/* Small camera badge at bottom-right */}
            <label 
              htmlFor="avatar-input" 
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gold-500 text-coffee-950 flex items-center justify-center border-2 border-white dark:border-coffee-900 shadow-md cursor-pointer hover:bg-gold-600 transition-colors z-20"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input 
              id="avatar-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarUpload} 
              disabled={isUploading} 
            />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-xl font-display font-bold text-coffee-950 dark:text-cream-50">{language === 'en' ? 'Profile Photo' : 'प्रोफाइल फोटो'}</h3>
            <p className="text-coffee-500 dark:text-coffee-400 text-xs leading-relaxed max-w-xs">
              {language === 'en' ? 'Upload a clear headshot. Accepted formats: PNG or JPG. Max file size: 5MB.' : 'एक स्पष्ट फोटो अपलोड करा. स्वीकारलेले प्रकार: PNG किंवा JPG. कमाल आकार: ५MB.'}
            </p>
            <div className="flex justify-center sm:justify-start">
              <label 
                htmlFor="avatar-input" 
                className="inline-flex items-center justify-center px-4 py-2 border border-coffee-200 dark:border-gold-500/20 rounded-xl text-xs font-bold text-coffee-700 dark:text-cream-200 hover:bg-coffee-50 dark:hover:bg-coffee-950 cursor-pointer shadow-sm hover:border-gold-500/40 transition-all duration-300"
              >
                {language === 'en' ? 'Upload Photo' : 'फोटो अपलोड करा'}
              </label>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-500 pb-1 border-b border-coffee-100 dark:border-gold-500/10">
                {t('personalDetails')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('fullName')}
                  placeholder={language === 'en' ? 'Enter your full name' : 'तुमचे पूर्ण नाव टाका'}
                  leftIcon={<User className="w-4 h-4 text-coffee-400" />}
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />
                <Input
                  label={t('phone')}
                  placeholder="e.g. +91 9876543210"
                  type="tel"
                  leftIcon={<Phone className="w-4 h-4 text-coffee-400" />}
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-500 pb-1 border-b border-coffee-100 dark:border-gold-500/10">
                {t('accountCredentials')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label={t('email')}
                    type="email"
                    leftIcon={<Mail className="w-4 h-4 text-coffee-400" />}
                    disabled
                    {...register('email')}
                    error={errors.email?.message}
                    className="bg-coffee-50/50 dark:bg-coffee-950/40 border-coffee-200/50 text-coffee-500 cursor-not-allowed select-none pr-20"
                  />
                  <span className="absolute right-3.5 top-[37px] flex items-center gap-1 text-[10px] font-bold text-forest-700 dark:text-forest-400 pointer-events-none bg-forest-500/10 dark:bg-forest-500/20 px-2.5 py-0.5 rounded-full border border-forest-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('verified')}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-coffee-700 dark:text-cream-200 flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-gold-500" />
                    {t('selectLanguage')}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-4 py-3 text-sm rounded-2xl border border-coffee-100 dark:border-gold-500/10 bg-white dark:bg-coffee-950/40 text-coffee-800 dark:text-cream-100 focus:outline-none focus:border-gold-500 transition-colors shadow-sm"
                  >
                    <option value="en">English (English)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-2">
                <div className="flex items-center p-4 bg-coffee-50/30 dark:bg-coffee-950/20 border border-coffee-100 dark:border-gold-500/5 rounded-2xl">
                  <div className="text-xs text-coffee-500 dark:text-coffee-400 leading-relaxed">
                    <p className="font-semibold text-coffee-950 dark:text-cream-100 flex items-center gap-1 mb-0.5">
                      <ShieldCheck className="w-4 h-4 text-forest-500" /> {t('secureAccount')}
                    </p>
                    {t('supportMessage')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                isLoading={updateMutation.isPending}
                className="bg-gradient-to-r from-forest-500 to-forest-600 hover:from-forest-600 hover:to-forest-700 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t('saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
