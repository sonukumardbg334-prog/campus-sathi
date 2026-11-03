import React from 'react';
import { DEMO_TIMETABLE } from '../../lib/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

export const StudentTimetablePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Weekly Schedule</span>
        <h1 className="text-2xl font-extrabold text-foreground mt-1">Class Timetable</h1>
        <p className="text-xs text-muted">
          B.Tech Computer Science & AI • Semester 6 (Spring 2026 Term)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_TIMETABLE.map((slot) => (
          <Card key={slot.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider font-mono">
                  {slot.day_of_week}
                </span>
                <span className="text-xs font-semibold text-teal-brand flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {slot.start_time} - {slot.end_time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{slot.subject_name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Room {slot.room_no}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {slot.teacher_name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

