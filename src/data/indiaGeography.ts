export interface StateUT {
  name: string;
  code: string;
  type: 'State' | 'Union Territory';
  districts: string[];
}

export const INDIA_STATES_AND_UTS: StateUT[] = [
  // 28 Indian States (Alphabetical)
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'State',
    districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada', 'Nellore', 'Kurnool', 'Anantapur', 'Kadapa', 'Rajahmundry'],
  },
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    type: 'State',
    districts: ['Itanagar', 'Naharlagun', 'Tawang', 'Pasighat', 'Ziro', 'Bomdila', 'Tezu'],
  },
  {
    name: 'Assam',
    code: 'AS',
    type: 'State',
    districts: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur', 'Nagaon', 'Tinsukia', 'Bongaigaon'],
  },
  {
    name: 'Bihar',
    code: 'BR',
    type: 'State',
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Rohtas', 'Begusarai', 'Nalanda', 'Ara'],
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    type: 'State',
    districts: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Ambikapur'],
  },
  {
    name: 'Goa',
    code: 'GA',
    type: 'State',
    districts: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim'],
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    type: 'State',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Anand', 'Jamnagar', 'Junagadh', 'Mehsana'],
  },
  {
    name: 'Haryana',
    code: 'HR',
    type: 'State',
    districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Rohtak', 'Karnal', 'Kurukshetra', 'Sonipat', 'Panchkula', 'Yamunanagar'],
  },
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    type: 'State',
    districts: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Hamirpur', 'Kullu', 'Kangra', 'Bilaspur', 'Una', 'Chamba'],
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    type: 'State',
    districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh'],
  },
  {
    name: 'Karnataka',
    code: 'KA',
    type: 'State',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi', 'Shivamogga', 'Kalaburagi', 'Manipal', 'Udupi', 'Ballari', 'Tumakuru'],
  },
  {
    name: 'Kerala',
    code: 'KL',
    type: 'State',
    districts: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Kottayam', 'Alappuzha', 'Malappuram'],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    type: 'State',
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Ratlam', 'Dewas'],
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    type: 'State',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Kolhapur', 'Solapur', 'Amravati', 'Navi Mumbai', 'Nanded', 'Jalgaon'],
  },
  {
    name: 'Manipur',
    code: 'MN',
    type: 'State',
    districts: ['Imphal West', 'Imphal East', 'Churachandpur', 'Thoubal', 'Bishnupur', 'Ukhrul', 'Senapati'],
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    type: 'State',
    districts: ['Shillong (East Khasi Hills)', 'Tura (West Garo Hills)', 'Jowai (West Jaintia Hills)', 'Nongpoh (Ri Bhoi)', 'Williamnagar'],
  },
  {
    name: 'Mizoram',
    code: 'MZ',
    type: 'State',
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Mamit'],
  },
  {
    name: 'Nagaland',
    code: 'NL',
    type: 'State',
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Mon', 'Chümoukedima'],
  },
  {
    name: 'Odisha',
    code: 'OD',
    type: 'State',
    districts: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Balasore', 'Puri', 'Baripada', 'Angul'],
  },
  {
    name: 'Punjab',
    code: 'PB',
    type: 'State',
    districts: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Faridkot', 'Gurdaspur', 'Kapurthala'],
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    type: 'State',
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Pilani (Jhunjhunu)', 'Alwar', 'Bharatpur', 'Sikar', 'Bhilwara'],
  },
  {
    name: 'Sikkim',
    code: 'SK',
    type: 'State',
    districts: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Pakyong', 'Soreng'],
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'State',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Kanchipuram', 'Dindigul', 'Tiruppur'],
  },
  {
    name: 'Telangana',
    code: 'TS',
    type: 'State',
    districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Nalgonda'],
  },
  {
    name: 'Tripura',
    code: 'TR',
    type: 'State',
    districts: ['Agartala (West Tripura)', 'Udaipur (Gomati)', 'Dharmanagar (North Tripura)', 'Kailashahar (Unakoti)', 'Ambassa'],
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    type: 'State',
    districts: ['Lucknow', 'Kanpur', 'Noida (Gautam Buddha Nagar)', 'Greater Noida', 'Varanasi', 'Prayagraj', 'Agra', 'Aligarh', 'Meerut', 'Ghaziabad', 'Bareilly', 'Gorakhpur', 'Mathura', 'Jhansi', 'Ayodhya'],
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    type: 'State',
    districts: ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Haldwani', 'Rishikesh', 'Pantnagar (Udham Singh Nagar)', 'Almora', 'Pauri Garhwal'],
  },
  {
    name: 'West Bengal',
    code: 'WB',
    type: 'State',
    districts: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol (Paschim Bardhaman)', 'Siliguri (Darjeeling)', 'Kharagpur (Paschim Medinipur)', 'Kalyani (Nadia)', 'Bardhaman', 'Hooghly', 'North 24 Parganas'],
  },

  // 8 Union Territories (Alphabetical)
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    type: 'Union Territory',
    districts: ['Port Blair', 'South Andaman', 'North and Middle Andaman', 'Nicobar'],
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    type: 'Union Territory',
    districts: ['Chandigarh (Main)', 'Sector 14 (Panjab University)', 'Sector 26', 'Manimajra'],
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DH',
    type: 'Union Territory',
    districts: ['Daman', 'Diu', 'Silvassa'],
  },
  {
    name: 'Delhi (NCT)',
    code: 'DL',
    type: 'Union Territory',
    districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Rohini', 'Connaught Place', 'Okhla', 'Hauz Khas'],
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    type: 'Union Territory',
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Pulwama', 'Samba'],
  },
  {
    name: 'Ladakh',
    code: 'LA',
    type: 'Union Territory',
    districts: ['Leh', 'Kargil'],
  },
  {
    name: 'Lakshadweep',
    code: 'LD',
    type: 'Union Territory',
    districts: ['Kavaratti', 'Agatti', 'Andrott', 'Minicoy'],
  },
  {
    name: 'Puducherry',
    code: 'PY',
    type: 'Union Territory',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
];

export const ALL_STATE_NAMES = INDIA_STATES_AND_UTS.map((item) => item.name);

export const getDistrictsByState = (stateName: string): string[] => {
  const found = INDIA_STATES_AND_UTS.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.districts : ['Main Campus'];
};

