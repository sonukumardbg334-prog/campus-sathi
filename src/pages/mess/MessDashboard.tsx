import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { campusStore } from '../../lib/store';
import { MessMenu, MessFeedback } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea, Input } from '../../components/ui/Input';
import { CollegeBackground } from '../../components/common/CollegeBackground';
import {
  UtensilsCrossed,
  Star,
  CheckCircle2,
  Edit3,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const MessDashboard: React.FC = () => {
  const { user } = useAuth();
  const [menus, setMenus] = useState<MessMenu[]>([]);
  const [feedbacks, setFeedbacks] = useState<MessFeedback[]>([]);

  // Menu Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MessMenu | null>(null);
  const [menuItemsText, setMenuItemsText] = useState('');
  const [dietaryNotesText, setDietaryNotesText] = useState('');

  useEffect(() => {
    const update = () => {
      setMenus(campusStore.getMessMenus());
      setFeedbacks(campusStore.getMessFeedback());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const handleOpenEdit = (m: MessMenu) => {
    setSelectedMenu(m);
    setMenuItemsText(m.menu_items);
    setDietaryNotesText(m.dietary_notes || '');
    setEditModalOpen(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;

    campusStore.updateMessMenu(selectedMenu.id, menuItemsText, dietaryNotesText);
    setEditModalOpen(false);
    setSelectedMenu(null);
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
      : '4.5';

  return (
    <div className="space-y-6">
      {/* Banner with Cinematic College Background */}
      <CollegeBackground
        variant="hero"
        overlayOpacity="medium"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Central Campus Dining Operations
          </div>
          <h1 className="text-2xl font-extrabold mt-1 text-white drop-shadow-sm">
            Hostel Mess & Dining Management
          </h1>
          <p className="text-xs text-slate-200">
            Manager: <span className="font-semibold text-white">{user?.full_name}</span> • Central Mess Kitchen & Dining Hall
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white backdrop-blur-xs border border-white/15">
            ⭐ {avgRating} / 5.0 Dining Satisfaction
          </div>
        </div>
      </CollegeBackground>

      {/* Menus Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Today's Active 4-Meal Menu</h2>
          <span className="text-xs text-muted">Click edit to update items served today</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menus.map((m) => (
            <Card key={m.id} className="hover:border-primary/40 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand font-mono">
                  {m.meal_type}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(m)}
                  className="p-1 rounded text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors"
                  title="Edit menu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-2 text-xs">
                <p className="text-slate-800 leading-relaxed font-medium">{m.menu_items}</p>
                {m.dietary_notes && (
                  <p className="text-[11px] text-muted border-t border-slate-100 pt-2">
                    ℹ️ {m.dietary_notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Meal Feedback Log */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Student Food Quality & Hygiene Reviews</CardTitle>
          <p className="text-xs text-muted">
            Feedback submitted directly by hostel residents via mobile app.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--nested-surface)] text-foreground font-semibold border-b border-[var(--card-border)]">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Meal Session</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Student Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-[var(--nested-surface)]/50 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{fb.student_name}</td>
                    <td className="p-4 font-mono font-bold text-teal-brand">{fb.meal_type}</td>
                    <td className="p-4">
                      <Badge variant="outline">{fb.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-foreground max-w-sm">{fb.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* EDIT MENU MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Update ${selectedMenu?.meal_type} Menu`}
        description="Update menu items served in dining hall for this meal session"
      >
        <form onSubmit={handleSaveMenu} className="space-y-4">
          <Textarea
            label="Menu Items (Comma-separated or dish list)"
            rows={3}
            value={menuItemsText}
            onChange={(e) => setMenuItemsText(e.target.value)}
            required
          />

          <Input
            label="Dietary / Serving Notes"
            placeholder="e.g. Served hot from 7:30 AM to 9:15 AM"
            value={dietaryNotesText}
            onChange={(e) => setDietaryNotesText(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Menu Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

