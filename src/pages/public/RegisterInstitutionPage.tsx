import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { campusStore } from '../../lib/store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CampusImageUploader } from '../../components/common/CampusImageUploader';
import { IndiaLocationSelector } from '../../components/common/IndiaLocationSelector';
import { Building, ShieldCheck, CheckCircle2, ArrowRight, Palette, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormValues {
  name: string;
  code: string;
  type: string;
  official_email: string;
  contact_person: string;
  phone: string;
  state: string;
  city: string;
  campus_count: number;
  website?: string;
  description?: string;
}

export const RegisterInstitutionPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<FormValues | null>(null);

  // Dynamic College Branding States
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [campusBgUrl, setCampusBgUrl] = useState<string | undefined>(undefined);
  const [primaryColor, setPrimaryColor] = useState<string>('#142B4A');
  const [secondaryColor, setSecondaryColor] = useState<string>('#2563EB');
  const [accentColor, setAccentColor] = useState<string>('#06B6D4');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      campus_count: 1,
      type: 'Autonomous College',
      name: '',
      code: '',
      official_email: '',
      contact_person: '',
      phone: '',
      state: 'Punjab',
      city: 'Amritsar',
      website: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate short network registration
    await new Promise((r) => setTimeout(r, 600));

    campusStore.registerInstitution({
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      official_email: data.official_email,
      phone: data.phone,
      state: data.state,
      city: data.city,
      campus_count: data.campus_count,
      website: data.website || undefined,
      description: data.description || undefined,
      logo_url: logoUrl,
      background_images: campusBgUrl ? [campusBgUrl] : ['/assets/khalsa-college-bg.jpg'],
      hero_tagline: `${data.name} — Center of Excellence`,
      theme_config: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        card_style: 'glass_dark',
        custom_tagline: `${data.name} — Center of Excellence`,
      },
    });

    setRegisteredData(data);
    setIsSuccess(true);
    reset();
  };

  const themePalettes = [
    { name: 'Heritage Navy & Cyan', primary: '#142B4A', secondary: '#2563EB', accent: '#06B6D4' },
    { name: 'Royal Burgundy & Amber', primary: '#5C1D24', secondary: '#EA580C', accent: '#F59E0B' },
    { name: 'Cobalt Blue & Emerald', primary: '#1E3A8A', secondary: '#0284C7', accent: '#10B981' },
    { name: 'Imperial Purple & Indigo', primary: '#3B0764', secondary: '#7C3AED', accent: '#38BDF8' },
  ];

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative z-10">
        {isSuccess ? (
          <Card className="border-cyan-400/30 shadow-2xl bg-[var(--card-background)] backdrop-blur-2xl text-[var(--card-foreground)]">
            <CardContent className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-500/15 dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-blue-400/30 dark:border-cyan-400/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  Application Successfully Registered
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--card-foreground)] mt-1">
                  {registeredData?.name}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2 max-w-lg mx-auto leading-relaxed">
                  Your campus has been queued with status{' '}
                  <span className="font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                    PENDING_APPROVAL
                  </span>
                  . The uploaded college branding and theme will activate across all portals upon Platform Super Admin verification.
                </p>
              </div>

              {/* Uploaded Branding Confirmation Preview */}
              {(campusBgUrl || logoUrl) && (
                <div className="p-4 rounded-2xl bg-[var(--nested-surface)] border border-[var(--card-border)] max-w-lg mx-auto text-left space-y-3">
                  <div className="text-xs font-bold text-[var(--card-foreground)] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    Branding Assets Attached
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {campusBgUrl && (
                      <div>
                        <div className="text-[11px] text-[var(--muted-foreground)] mb-1">Campus Background:</div>
                        <img
                          src={campusBgUrl}
                          alt="Campus background preview"
                          className="h-24 w-full object-cover rounded-xl border border-[var(--card-border)]"
                        />
                      </div>
                    )}
                    {logoUrl && (
                      <div>
                        <div className="text-[11px] text-[var(--muted-foreground)] mb-1">College Emblem:</div>
                        <img
                          src={logoUrl}
                          alt="College logo preview"
                          className="h-24 w-full object-contain bg-slate-900 rounded-xl border border-[var(--card-border)] p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] text-xs text-[var(--muted-foreground)] max-w-md mx-auto space-y-1.5 text-left">
                <div><span className="font-semibold text-[var(--card-foreground)]">Official Email:</span> {registeredData?.official_email}</div>
                <div><span className="font-semibold text-[var(--card-foreground)]">Campus Code:</span> {registeredData?.code.toUpperCase()}</div>
                <div><span className="font-semibold text-[var(--card-foreground)]">Location:</span> {registeredData?.city}, {registeredData?.state}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <Link to="/institutions">
                  <Button variant="outline" className="text-[var(--card-foreground)] border-[var(--card-border)] hover:bg-[var(--nested-surface)]">View Campus Directory</Button>
                </Link>
                <Link to="/app/superadmin">
                  <Button variant="primary" className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Review in Superadmin Console
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl bg-[var(--card-background)] backdrop-blur-2xl border border-[var(--card-border)] text-[var(--card-foreground)]">
            <CardHeader className="border-b border-[var(--card-border)] pb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-amber-400/40 p-1 flex items-center justify-center shadow-xl overflow-hidden shrink-0">
                  <img
                    src="/assets/campussaathi-logo.png"
                    alt="CampusSaathi Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                    <Building className="w-4 h-4" /> Onboard Higher-Ed Campus
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-extrabold text-[var(--card-foreground)] mt-0.5">
                    Register Your Institution
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2">
                Digitalize your campus operations with dedicated student, faculty, warden, parent, and administrative portals.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 1. Basic Campus Identity */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--card-foreground)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <Building className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> Institution Identity
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Official Institution Name"
                        placeholder="e.g. Guru Nanak Dev University"
                        {...register('name')}
                        error={errors.name?.message}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Short Campus Code"
                        placeholder="e.g. GNDU"
                        {...register('code')}
                        error={errors.code?.message}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Institution Type" {...register('type')} error={errors.type?.message} required>
                      <option value="Autonomous College">Autonomous College</option>
                      <option value="State University">State University</option>
                      <option value="Central University">Central University</option>
                      <option value="Private University">Private University</option>
                      <option value="Institute of National Importance (IIT/NIT)">Institute of National Importance (IIT/NIT)</option>
                      <option value="Affiliated Engineering College">Affiliated Engineering College</option>
                    </Select>

                    <Input
                      label="Official Institutional Email"
                      type="email"
                      placeholder="admin@college.edu.in"
                      {...register('official_email')}
                      error={errors.official_email?.message}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Administrator Full Name"
                      placeholder="e.g. Dr. Harpreet Kaur"
                      {...register('contact_person')}
                      error={errors.contact_person?.message}
                      required
                    />
                    <Input
                      label="Phone / Mobile Number"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      error={errors.phone?.message}
                      required
                    />
                  </div>

                  {/* Nationwide Indian State / UT and District Selector */}
                  <div className="space-y-3">
                    <IndiaLocationSelector
                      selectedState={watch('state')}
                      selectedCity={watch('city')}
                      onStateChange={(st) => setValue('state', st)}
                      onCityChange={(ct) => setValue('city', ct)}
                      stateLabel="State / Union Territory"
                      cityLabel="District / City"
                      glassmorphism={true}
                    />

                    <div>
                      <Input
                        label="Number of Campuses"
                        type="number"
                        min="1"
                        max="20"
                        {...register('campus_count')}
                        error={errors.campus_count?.message}
                        required
                      />
                    </div>
                  </div>

                  <Input
                    label="Official Website URL"
                    placeholder="https://www.institution.edu.in"
                    {...register('website')}
                    error={errors.website?.message}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-[var(--card-foreground)] mb-1.5">
                      Institution Description / Mission
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief summary of campus history, accreditation, and technical departments..."
                      {...register('description')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--input-background)] backdrop-blur-md border border-[var(--card-border)] text-xs sm:text-sm text-[var(--input-foreground)] placeholder:[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* 2. Campus Visual Assets & Theme */}
                <div className="space-y-4 pt-4 border-t border-[var(--card-border)]">
                  <h3 className="text-sm font-bold text-[var(--card-foreground)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                    <ImageIcon className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> College Photography & Visual Branding
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CampusImageUploader
                      label="Official Campus Background Photograph"
                      helperText="High-res hero image (JPG, PNG, WebP up to 5MB)"
                      value={campusBgUrl}
                      onChange={setCampusBgUrl}
                      aspectRatio="hero"
                      placeholderText="Drop campus photograph here"
                    />

                    <CampusImageUploader
                      label="Official College Emblem / Logo"
                      helperText="Transparent emblem or crest (PNG, WebP up to 5MB)"
                      value={logoUrl}
                      onChange={setLogoUrl}
                      aspectRatio="logo"
                      placeholderText="Drop college emblem here"
                    />
                  </div>

                  {/* Theme Palette Customizer */}
                  <div className="p-4 rounded-2xl bg-[var(--nested-surface)] border border-[var(--card-border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--card-foreground)] flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Select College Brand Color Palette
                      </span>
                      <span className="text-[11px] text-[var(--muted-foreground)]">Customizes student & admin portals</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {themePalettes.map((p) => {
                        const isSelected = primaryColor === p.primary;
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => {
                              setPrimaryColor(p.primary);
                              setSecondaryColor(p.secondary);
                              setAccentColor(p.accent);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-500/15 shadow-md ring-1 ring-cyan-400'
                                : 'border-[var(--card-border)] bg-[var(--card-background)] hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.secondary }} />
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.accent }} />
                            </div>
                            <div className="text-[11px] font-semibold text-[var(--card-foreground)] truncate">{p.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Security Guardrail */}
                <div className="p-3.5 rounded-xl bg-[var(--nested-surface)] border border-[var(--card-border)] text-xs text-[var(--muted-foreground)] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[var(--card-foreground)]">Zero-Trust Guarantee:</strong> Submitted colleges enter <code className="text-blue-600 dark:text-cyan-300 font-mono">PENDING_APPROVAL</code>. Data isolation policies enforce that unverified institutions cannot view or access records from other colleges.
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                >
                  Submit Institution Application
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
