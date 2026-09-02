/**
 * Itinerary Data
 * Common item fields: id, type, time, title, titleZh, thumbnail, icon, details
 * Supported types: activity | restaurant | flight | transfer | other
 *
 * Restaurant items never embed a full restaurant record — they reference
 * restaurants.js by id (restaurantId / nearbyRestaurantIds).
 *
 * Activity details only surface the destination's metroStation / metroExit
 * (no in-between commuting steps) plus entranceFee where relevant.
 */
window.ITINERARY_DATA = [
  {
    id: "day-1",
    dayNumber: 1,
    date: "2026-10-22",
    weather: {
      forecast: "Partly cloudy",
      temperature: "24–29°C",
      rain: "20%",
      humidity: "70%",
      wind: "10 km/h",
      feelsLike: "29°C",
      uvIndex: 6
    },
    items: [
      {
        id: "d1-flight-in",
        type: "flight",
        time: "10:30",
        title: "Flight to Guangzhou",
        titleZh: "飞往广州",
        icon: "flight",
        airline: "Spring Airlines",
        flightNumber: "9C8934",
        departureAirport: "CNX",
        arrivalAirport: "CAN",
        departureTime: "10:30",
        arrivalTime: "14:20"
      },
      {
        id: "d1-hotel-checkin",
        type: "other",
        time: "16:00",
        title: "Hotel Check-in",
        titleZh: "酒店入住",
        icon: "hotel",
        details: {
          description: "เช็คอินที่ Grand Tianhe Hotel พักผ่อนก่อนออกไปเที่ยวตอนเย็น",
          location: "Grand Tianhe Hotel, Tianhe District"
        }
      },
      {
        id: "d1-beijing-road",
        type: "activity",
        time: "18:30",
        title: "Beijing Road Pedestrian Street",
        titleZh: "北京路步行街",
        thumbnail: "assets/images/activities/beijing-road.svg",
        icon: "shopping",
        details: {
          description:
            "ถนนคนเดินเก่าแก่ใจกลางเมือง มีร่องรอยถนนโบราณให้ชมใต้กระจก และร้านค้าสองฝั่งถนนคึกคักยามค่ำ",
          location: "Beijing Road, Yuexiu District",
          metroStation: "Gongyuanqian",
          metroExit: "B"
        }
      },
      {
        id: "d1-dinner",
        type: "restaurant",
        time: "19:30",
        title: "Dinner",
        titleZh: "晚餐",
        icon: "food",
        restaurantId: "restaurant-006",
        nearbyRestaurantIds: ["restaurant-006", "restaurant-005"]
      }
    ]
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "2026-10-23",
    weather: {
      forecast: "Sunny",
      temperature: "25–31°C",
      rain: "10%",
      humidity: "65%",
      wind: "13 km/h",
      feelsLike: "32°C",
      uvIndex: 8
    },
    items: [
      {
        id: "d2-chen-clan",
        type: "activity",
        time: "09:00",
        title: "Chen Clan Academy",
        titleZh: "陈家祠",
        thumbnail: "assets/images/activities/chen-clan-academy.svg",
        icon: "museum",
        details: {
          description:
            "ศาลาบรรพบุรุษตระกูลเฉินที่มีงานแกะสลักไม้และปูนปั้นสวยงามที่สุดแห่งหนึ่งของกวางตุ้ง",
          location: "34 Enlong Li, Liwan District",
          metroStation: "Chen Clan Academy",
          metroExit: "D",
          entranceFee: "¥10",
          ticketUrl: "",
          referenceUrl: "",
          referenceLabel: ""
        }
      },
      {
        id: "d2-lunch",
        type: "restaurant",
        time: "12:00",
        title: "Lunch",
        titleZh: "午餐",
        icon: "food",
        restaurantId: "restaurant-001",
        nearbyRestaurantIds: ["restaurant-001", "restaurant-002"]
      },
      {
        id: "d2-canton-tower",
        type: "activity",
        time: "14:30",
        title: "Canton Tower",
        titleZh: "广州塔",
        thumbnail: "assets/images/activities/canton-tower.svg",
        icon: "landmark",
        details: {
          description:
            "หอคอยสัญลักษณ์ของกวางโจว ขึ้นชมวิวเมืองและแม่น้ำจูเจียงแบบพาโนรามา",
          location: "222 Yuejiang West Road, Haizhu District",
          metroStation: "Canton Tower",
          metroExit: "B1",
          entranceFee: "¥150",
          ticketUrl: "https://www.cantontower.com/",
          referenceUrl: "https://www.tripadvisor.com/",
          referenceLabel: "Reviews"
        }
      },
      {
        id: "d2-riverside-break",
        type: "activity",
        time: "17:30",
        title: "Haixinsha Square",
        titleZh: "海心沙",
        thumbnail: "assets/images/activities/haixinsha.svg",
        icon: "park",
        details: {
          description: "สวนสาธารณะริมแม่น้ำ จุดถ่ายรูปหอคอยแคนตันวิวสวยตอนพลบค่ำ",
          location: "Haixinsha Island, Tianhe District"
        }
      },
      {
        id: "d2-dinner",
        type: "restaurant",
        time: "19:00",
        title: "Dinner",
        titleZh: "晚餐",
        icon: "food",
        restaurantId: "restaurant-003",
        nearbyRestaurantIds: ["restaurant-003", "restaurant-004"]
      },
      {
        id: "d2-river-cruise",
        type: "activity",
        time: "20:30",
        title: "Pearl River Night Cruise",
        titleZh: "珠江夜游",
        thumbnail: "assets/images/activities/pearl-river-cruise.svg",
        icon: "night-view",
        details: {
          description: "ล่องเรือชมไฟประดับสองฝั่งแม่น้ำจูเจียงยามค่ำคืน บรรยากาศโรแมนติก",
          location: "Xidi Pier, Yuexiu District",
          metroStation: "Haizhu Square",
          metroExit: "C",
          entranceFee: "¥88",
          ticketUrl: ""
        }
      }
    ]
  },
  {
    id: "day-3",
    dayNumber: 3,
    date: "2026-10-24",
    weather: {
      forecast: "Light rain",
      temperature: "23–27°C",
      rain: "60%",
      humidity: "80%",
      wind: "16 km/h",
      feelsLike: "27°C",
      uvIndex: 4
    },
    items: [
      {
        id: "d3-shamian",
        type: "activity",
        time: "09:30",
        title: "Shamian Island",
        titleZh: "沙面岛",
        thumbnail: "assets/images/activities/shamian-island.svg",
        icon: "landmark",
        details: {
          description:
            "เกาะเล็ก ๆ ริมแม่น้ำที่เต็มไปด้วยอาคารสไตล์ยุโรปเก่า เดินเล่นถ่ายรูปสบาย ๆ",
          location: "Shamian Island, Liwan District",
          metroStation: "Huangsha",
          metroExit: "F"
        }
      },
      {
        id: "d3-lunch",
        type: "restaurant",
        time: "12:00",
        title: "Lunch",
        titleZh: "午餐",
        icon: "food",
        restaurantId: "restaurant-007",
        nearbyRestaurantIds: ["restaurant-007"]
      },
      {
        id: "d3-yuexiu-park",
        type: "activity",
        time: "14:00",
        title: "Yuexiu Park",
        titleZh: "越秀公园",
        thumbnail: "assets/images/activities/yuexiu-park.svg",
        icon: "park",
        details: {
          description:
            "สวนสาธารณะที่ใหญ่ที่สุดในกวางโจว มีรูปปั้นแพะห้าตัวอันเป็นสัญลักษณ์ของเมือง",
          location: "988 Jiefang North Road, Yuexiu District",
          metroStation: "Yuexiu Park",
          metroExit: "A",
          entranceFee: "Free"
        }
      },
      {
        id: "d3-hotel-checkin",
        type: "other",
        time: "18:00",
        title: "Hotel Check-in",
        titleZh: "酒店入住",
        icon: "hotel",
        details: {
          description: "เช็คอินที่ Baiyun Airport Transit Hotel",
          location: "Baiyun Airport Transit Hotel"
        }
      },
      {
        id: "d3-dinner",
        type: "restaurant",
        time: "19:30",
        title: "Dinner",
        titleZh: "晚餐",
        icon: "food",
        restaurantId: "restaurant-008",
        nearbyRestaurantIds: ["restaurant-008", "restaurant-009"]
      }
    ]
  },
  {
    id: "day-4",
    dayNumber: 4,
    date: "2026-10-25",
    items: [
      {
        id: "d4-breakfast",
        type: "restaurant",
        time: "08:30",
        title: "Breakfast",
        titleZh: "早餐",
        icon: "food",
        restaurantId: "restaurant-009",
        nearbyRestaurantIds: ["restaurant-009"]
      },
      {
        id: "d4-last-shopping",
        type: "activity",
        time: "10:00",
        title: "Last-minute Shopping",
        titleZh: "最后采购",
        thumbnail: "assets/images/activities/shopping.svg",
        icon: "shopping",
        details: {
          description: "ช้อปปิ้งของฝากรอบสุดท้ายก่อนเดินทางกลับ",
          location: "Tianhe District"
        }
      }
    ]
  },
  {
    id: "day-5",
    dayNumber: 5,
    date: "2026-10-26",
    items: [
      {
        id: "d5-flight-out",
        type: "flight",
        time: "15:40",
        title: "Flight to Chiang Mai",
        titleZh: "飞往清迈",
        icon: "flight",
        airline: "Spring Airlines",
        flightNumber: "9C8933",
        departureAirport: "CAN",
        arrivalAirport: "CNX",
        departureTime: "15:40",
        arrivalTime: "17:35"
      }
    ]
  }
];
