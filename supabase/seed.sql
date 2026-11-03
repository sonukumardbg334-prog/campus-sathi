-- ====================================================================
-- CampusSaathi Demo Seed Data (Fictional higher-ed institutions)
-- ====================================================================

-- 1. Institutions
INSERT INTO public.institutions (id, code, name, type, official_email, phone, state, city, campus_count, website, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'AITM', 'Apex Institute of Technology & Management', 'Autonomous Institute', 'admin@apextech.edu.in', '+91 180 225 8097', 'Delhi NCR', 'New Delhi', 2, 'https://apextech.edu.in', 'APPROVED'),
  ('22222222-2222-2222-2222-222222222222', 'LPU-PB', 'Lovely Professional University', 'Private University', 'campus@lpu.co.in', '+91 1824 517000', 'Punjab', 'Phagwara', 1, 'https://lpu.in', 'APPROVED'),
  ('33333333-3333-3333-3333-333333333333', 'IITD', 'Indian Institute of Technology Delhi', 'Institute of National Importance', 'office@iitd.ac.in', '+91 11 2659 7135', 'Delhi', 'New Delhi', 1, 'https://iitd.ac.in', 'APPROVED'),
  ('44444444-4444-4444-4444-444444444444', 'GNDU-ASR', 'Guru Nanak Dev University', 'State University', 'registrar@gndu.ac.in', '+91 183 2258802', 'Punjab', 'Amritsar', 1, 'https://gndu.ac.in', 'PENDING_APPROVAL')
ON CONFLICT (id) DO NOTHING;

-- 2. Campuses
INSERT INTO public.campuses (id, institution_id, name, code, city, state)
VALUES
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Main Heritage Campus', 'KHC-MAIN', 'Amritsar', 'Punjab'),
  ('c1111111-2222-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'North Technology Block', 'KHC-TECH', 'Amritsar', 'Punjab')
ON CONFLICT (id) DO NOTHING;

-- 3. Departments
INSERT INTO public.departments (id, institution_id, name, code, description)
VALUES
  ('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE', 'School of Computer Science & Applied AI'),
  ('d2222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Electrical & Electronics Engineering', 'EEE', 'Department of Electrical Engineering'),
  ('d3333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Estate & Campus Maintenance', 'MAINT', 'Facility, Hostel & Infrastructure Maintenance')
ON CONFLICT (id) DO NOTHING;

-- 4. Hostels & Blocks
INSERT INTO public.hostels (id, institution_id, name, gender, capacity)
VALUES
  ('h1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Bhagat Singh Boys Hostel', 'BOYS', 350),
  ('h2222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Kalpana Chawla Girls Hostel', 'GIRLS', 300)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hostel_blocks (id, hostel_id, name, total_floors)
VALUES
  ('b1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Block A (Aryabhata Wing)', 4),
  ('b2222222-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Block B (Ramanujan Wing)', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hostel_rooms (id, block_id, room_number, floor_number, capacity, occupied_count)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'A-204', 2, 2, 2),
  ('r2222222-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'A-305', 3, 2, 1)
ON CONFLICT (id) DO NOTHING;

-- 5. Mess Menus
INSERT INTO public.mess_menus (institution_id, day_of_week, meal_type, menu_items, dietary_notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'BREAKFAST', 'Aloo Paratha, Curd, Mint Chutney, Boiled Eggs / Banana, Tea / Coffee', 'Pure Desi Ghee preparation on request'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'LUNCH', 'Dal Makhani, Seasonal Mix Veg, Jeera Rice, Tandoori Roti, Salad & Boondi Raita', 'Jain food counter available'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'SNACKS', 'Veg Samosa (2 pcs), Green Chutney, Masala Chai', 'Served hot from 4:30 PM to 6:00 PM'),
  ('11111111-1111-1111-1111-111111111111', 'Monday', 'DINNER', 'Shahi Paneer / Chicken Curry, Yellow Dal Tadka, Steam Rice, Chapati, Gulab Jamun', 'Special dessert night')
ON CONFLICT DO NOTHING;

