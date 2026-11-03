import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { MessMenu, MessFeedback, MealType } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, Textarea } from '../../components/ui/Input';
import { PhotoUpload } from '../../components/ui/PhotoUpload';
import { UtensilsCrossed, Star, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const StudentMessFeedbackPage: React.FC = () => {
  const { user, institution } = useAuth();
  const [menus, setMenus] = useState<MessMenu[]>([]);
  const [feedbackList, setFeedbackList] = useState<MessFeedback[]>([]);

  const [mealType, setMealType] = useState<MealType>('LUNCH');
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<'TASTE' | 'HYGIENE' | 'TEMPERATURE' | 'SHORTAGE' | 'OTHER'>('TASTE');
  const [comments, setComments] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const update = () => {
      setMenus(campusStore.getMessMenus());
      setFeedbackList(campusStore.getMessFeedback());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim() || !user) return;

    campusStore.submitMessFeedback({
      institution_id: institution?.id || 'inst-1',
      student_id: user.id,
      student_name: user.full_name,
      meal_type: mealType,
      rating,
      category,
      comments: comments.trim(),
      photo_url: photoUrl,
    });

    setIsSubmitted(true);
    setComments('');
    setPhotoUrl(undefined);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Campus Dining Services</span>
        <h1 className="text-2xl font-extrabold text-foreground mt-1">Daily Mess Menu & Meal Feedback</h1>
        <p className="text-xs text-muted">
          Review today's 4-meal hostel menu and submit real-time taste, hygiene, and service feedback.
        </p>
      </div>

      {/* 4 Daily Meals Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menus.map((m) => (
          <Card key={m.id} className="hover:border-primary/30 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand font-mono">
                {m.meal_type}
              </span>
              <CardTitle className="text-sm font-bold text-foreground mt-0.5">
                {m.meal_type === 'BREAKFAST' && 'Morning Breakfast'}
                {m.meal_type === 'LUNCH' && 'Midday Lunch'}
                {m.meal_type === 'SNACKS' && 'Evening Refreshments'}
                {m.meal_type === 'DINNER' && 'Night Dinner'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-slate-700 leading-relaxed font-medium">{m.menu_items}</p>
              {m.dietary_notes && (
                <p className="text-[11px] text-muted border-t border-slate-100 pt-2">
                  ℹ️ {m.dietary_notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-teal-brand text-xs font-semibold uppercase tracking-wider">
                <UtensilsCrossed className="w-4 h-4" /> Student Dining Feedback
              </div>
              <CardTitle className="text-lg font-bold">Rate Today's Meal or Report Quality Issue</CardTitle>
              <CardDescription>
                Directly reviewed by Chef Surinder Gill (Mess Manager) and Chief Warden.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSubmitted && (
                <div className="mb-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-brand" />
                  <span>Thank you! Your dining feedback has been recorded and dispatched to the Mess Manager.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Meal Session"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    required
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="SNACKS">Evening Snacks</option>
                    <option value="DINNER">Dinner</option>
                  </Select>

                  <Select
                    label="Feedback Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    required
                  >
                    <option value="TASTE">Taste & Flavor</option>
                    <option value="HYGIENE">Sanitation & Cleanliness</option>
                    <option value="TEMPERATURE">Food Temperature (Cold/Warm)</option>
                    <option value="SHORTAGE">Item Shortage / Delay</option>
                    <option value="OTHER">Other Dining Concern</option>
                  </Select>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`p-1.5 rounded-md transition-colors ${
                            s <= rating ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Textarea
                  label="Comments & Suggestions"
                  placeholder="Share details about food quality, taste, freshness, or dining hall cleanliness..."
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                />

                <PhotoUpload
                  label="Attach Photograph (Optional)"
                  helperText="Attach photo if reporting unhygienic conditions or cold meals"
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  captureMode={true}
                />

                <Button type="submit" variant="primary" size="md">
                  Submit Meal Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Community Meal Feedback */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Student Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-xs">
              {feedbackList.slice(0, 3).map((fb) => (
                <div key={fb.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">{fb.student_name}</span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-teal-brand font-semibold uppercase tracking-wider">
                    {fb.meal_type} • {fb.category}
                  </span>
                  <p className="text-slate-600 leading-snug">{fb.comments}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

