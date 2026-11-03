import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campusStore } from '../../lib/store';
import { Institution, InstitutionStatus } from '../../types';
import { NATIONAL_INSTITUTIONS_DIRECTORY, NationalInstitutionDirectoryItem } from '../../data/indiaInstitutions';
import { INDIA_STATES_AND_UTS } from '../../data/indiaGeography';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Search,
  Building,
  MapPin,
  Mail,
  Phone,
  PlusCircle,
  CheckCircle,
  Clock,
  Filter,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react';

export const InstitutionsPage: React.FC = () => {
  const [storeInstitutions, setStoreInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  // "Missing Institution" submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestState, setSuggestState] = useState('Punjab');
  const [suggestDistrict, setSuggestDistrict] = useState('Amritsar');
  const [suggestAffiliation, setSuggestAffiliation] = useState('');
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);

  useEffect(() => {
    const update = () => {
      setStoreInstitutions(campusStore.getInstitutions());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  // Combine store institutions and national directory items
  const allInstitutions: Array<{
    id: string;
    name: string;
    code: string;
    type: string;
    state: string;
    city: string;
    official_email: string;
    phone?: string;
    status: InstitutionStatus;
    campus_count: number;
    affiliation?: string;
    isDemoAvailable?: boolean;
  }> = [
    // Dynamic store institutions (registered by user or seed)
    ...storeInstitutions.map((i) => ({
      id: i.id,
      name: i.name,
      code: i.code,
      type: i.type,
      state: i.state,
      city: i.city,
      official_email: i.official_email,
      phone: i.phone,
      status: i.status,
      campus_count: i.campus_count || 1,
      affiliation: 'Autonomous / Affiliated University',
      isDemoAvailable: true,
    })),
    // National directory institutions (if not already present in store)
    ...NATIONAL_INSTITUTIONS_DIRECTORY.filter(
      (nat) => !storeInstitutions.some((si) => si.code.toLowerCase() === nat.shortCode.toLowerCase())
    ).map((nat) => ({
      id: nat.id,
      name: nat.name,
      code: nat.shortCode,
      type: nat.category,
      state: nat.state,
      city: nat.district,
      official_email: nat.contactEmail,
      status: 'APPROVED' as InstitutionStatus,
      campus_count: nat.campusCount,
      affiliation: nat.affiliation,
      isDemoAvailable: nat.isDemoAvailable,
    })),
  ];

  const categories = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Autonomous Colleges', value: 'Autonomous College' },
    { label: 'IIT / NIT / IIIT', value: 'IIT/NIT/IIIT' },
    { label: 'State Universities', value: 'State University' },
    { label: 'Central Universities', value: 'Central University' },
    { label: 'Private Universities', value: 'Private University' },
  ];

  const filtered = allInstitutions.filter((inst) => {
    // Search match
    const matchesSearch =
      !search ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.city.toLowerCase().includes(search.toLowerCase()) ||
      inst.state.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.toLowerCase().includes(search.toLowerCase()) ||
      (inst.affiliation && inst.affiliation.toLowerCase().includes(search.toLowerCase()));

    // Category match
    const matchesCategory =
      selectedCategory === 'ALL' ||
      inst.type.toLowerCase().includes(selectedCategory.toLowerCase());

    // State match
    const matchesState =
      selectedState === 'ALL' || inst.state.toLowerCase() === selectedState.toLowerCase();

    return matchesSearch && matchesCategory && matchesState;
  });

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestName.trim()) return;

    // Register into store as PENDING review institution
    const words = suggestName.trim().split(/\s+/);
    const code =
      words.length >= 2
        ? words.slice(0, 4).map((w) => w[0].toUpperCase()).join('')
        : suggestName.slice(0, 4).toUpperCase();

    campusStore.registerInstitution({
      name: suggestName.trim(),
      code,
      type: 'Autonomous College',
      official_email: `contact@${code.toLowerCase()}.edu.in`,
      state: suggestState,
      city: suggestDistrict,
      campus_count: 1,
    });

    setSuggestSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[var(--page-foreground)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-amber-400/40 p-1 flex items-center justify-center shadow-xl overflow-hidden shrink-0">
            <img
              src="/assets/campussaathi-logo.png"
              alt="CampusSaathi Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Pan-India Campus Network
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-400/30 dark:border-cyan-400/30">
                28 States • 8 UTs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--page-foreground)] mt-0.5">
              Institutions Directory
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Colleges, universities, and polytechnics enabled with CampusSaathi smart operations & grievance resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSuggestSubmitted(false);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--card-background)] hover:bg-[var(--surface-background)] backdrop-blur-md border border-[var(--card-border)] text-xs font-semibold text-[var(--card-foreground)] flex items-center gap-2 transition hover:border-cyan-400/50 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Missing Institution?</span>
          </button>

          <Link to="/register-institution">
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-xs"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Register Campus
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Text Search input */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600 dark:text-cyan-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name, city, district, state, code, or affiliation..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--input-background)] backdrop-blur-md text-xs sm:text-sm text-[var(--input-foreground)] border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 placeholder:text-[var(--muted-foreground)] shadow-inner"
            />
          </div>

          {/* State / UT filter dropdown */}
          <div className="sm:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600 dark:text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[var(--input-background)] backdrop-blur-md text-xs sm:text-sm text-[var(--input-foreground)] border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 cursor-pointer shadow-inner"
            >
              <option value="ALL" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                All 28 States & 8 Union Territories ({allInstitutions.length} Institutions)
              </option>
              <optgroup label="28 States" className="bg-slate-100 text-blue-700 dark:bg-slate-900 dark:text-cyan-300 font-bold">
                {INDIA_STATES_AND_UTS.filter((s) => s.type === 'State').map((s) => (
                  <option key={s.name} value={s.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-normal">
                    {s.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="8 Union Territories" className="bg-slate-100 text-teal-700 dark:bg-slate-900 dark:text-teal-300 font-bold">
                {INDIA_STATES_AND_UTS.filter((s) => s.type === 'Union Territory').map((s) => (
                  <option key={s.name} value={s.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white font-normal">
                    {s.name} (UT)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                  : 'bg-[var(--nested-surface)] hover:bg-[var(--card-background)] text-[var(--card-foreground)] border border-[var(--card-border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <Card
            key={inst.id}
            className="bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] text-[var(--card-foreground)] shadow-xl hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all flex flex-col justify-between group"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-400/30 text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform shadow-xs">
                  <Building className="w-6 h-6" />
                </div>
                {inst.status === 'APPROVED' ? (
                  <Badge
                    variant="success"
                    className="flex items-center gap-1 text-[10px]"
                  >
                    <CheckCircle className="w-3 h-3" /> Campus Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="warning"
                    className="flex items-center gap-1 text-[10px]"
                  >
                    <Clock className="w-3 h-3" /> In Verification
                  </Badge>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                  {inst.code} • {inst.type}
                </span>
                <h3 className="text-base font-bold text-[var(--card-foreground)] mt-0.5 leading-snug">
                  {inst.name}
                </h3>
                {inst.affiliation && (
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1 line-clamp-1">
                    {inst.affiliation}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-xs text-[var(--muted-foreground)] border-t border-[var(--card-border)] pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>
                    {inst.city}, {inst.state} ({inst.campus_count}{' '}
                    {inst.campus_count === 1 ? 'Campus' : 'Campuses'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">{inst.official_email}</span>
                </div>
                {inst.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>{inst.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs">
                <Link
                  to={`/login?inst=${inst.id}`}
                  className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1 group-hover:underline"
                >
                  <span>Portal Login</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/register"
                  className="text-[var(--muted-foreground)] hover:text-[var(--card-foreground)] transition font-medium"
                >
                  Join as Faculty/Student
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center bg-[var(--card-background)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl p-6 text-[var(--card-foreground)] space-y-3 shadow-xl">
          <Building className="w-10 h-10 text-[var(--muted-foreground)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--card-foreground)]">No institutions match your search</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            Can't find your college? You can submit your college for fast-track verification.
          </p>
          <button
            onClick={() => {
              setSuggestName(search);
              setSuggestSubmitted(false);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit "{search || 'My College'}"</span>
          </button>
        </div>
      )}

      {/* Missing Institution Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-[var(--card-background)] backdrop-blur-2xl border border-[var(--card-border)] rounded-2xl p-6 shadow-2xl text-[var(--card-foreground)] relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[var(--card-foreground)] hover:bg-[var(--nested-surface)]"
            >
              <X className="w-5 h-5" />
            </button>

            {suggestSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--card-foreground)]">Submission Queued!</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    <strong className="text-[var(--card-foreground)]">{suggestName}</strong> in {suggestDistrict}, {suggestState} has been queued in the CampusSaathi verification directory.
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="primary"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-500"
                >
                  Return to Directory
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                    Community Suggestion
                  </span>
                  <h3 className="text-lg font-bold text-[var(--card-foreground)] mt-0.5">
                    Request Campus Onboarding
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    Submit your college or university to add it to CampusSaathi.
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--card-foreground)] mb-1">
                      College / University Name *
                    </label>
                    <input
                      type="text"
                      value={suggestName}
                      onChange={(e) => setSuggestName(e.target.value)}
                      placeholder="e.g. Punjabi University"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-sm text-[var(--input-foreground)] placeholder:[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--card-foreground)] mb-1">
                        State / UT *
                      </label>
                      <select
                        value={suggestState}
                        onChange={(e) => setSuggestState(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-xs text-[var(--input-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                      >
                        {INDIA_STATES_AND_UTS.map((s) => (
                          <option key={s.name} value={s.name} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--card-foreground)] mb-1">
                        District / City *
                      </label>
                      <input
                        type="text"
                        value={suggestDistrict}
                        onChange={(e) => setSuggestDistrict(e.target.value)}
                        placeholder="e.g. Patiala"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-xs text-[var(--input-foreground)] placeholder:[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--card-foreground)] mb-1">
                      Affiliation / Approving Body (Optional)
                    </label>
                    <input
                      type="text"
                      value={suggestAffiliation}
                      onChange={(e) => setSuggestAffiliation(e.target.value)}
                      placeholder="e.g. UGC / AICTE / State University"
                      className="w-full px-3 py-2 rounded-xl bg-[var(--input-background)] border border-[var(--card-border)] text-xs text-[var(--input-foreground)] placeholder:[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 border-[var(--card-border)] text-[var(--card-foreground)] hover:bg-[var(--nested-surface)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-1/2 bg-blue-600 hover:bg-blue-500 shadow-md"
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Submit College
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-4 rounded-xl bg-[var(--card-background)] backdrop-blur-md border border-[var(--card-border)] text-center text-xs text-[var(--muted-foreground)] shadow-sm">
        Note: Institution names and codes are illustrative examples for hackathon demonstration. CampusSaathi does not claim official endorsement by any individual institution.
      </div>
    </div>
  );
};
