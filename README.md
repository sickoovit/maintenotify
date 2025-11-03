# 🔧 Maintenotify

> **Automated device maintenance tracking with WhatsApp notifications for repair shops.**

Stop chasing customers. Start notifying them automatically when their device status changes.

---

## 🎯 What It Does

Track devices (laptops, phones, computers) through the repair process and automatically notify customers via WhatsApp at every step:

```
RECEIVED → WORKING → DONE → DELIVERED
```

Each status change triggers an automatic WhatsApp message. Customers can reply, and you manage everything from one place.

---

## ✨ Current Version (v0.5 - MVP)

**What's Working:**

- ✅ Device tracking with status management
- ✅ Client management with phone numbers
- ✅ Automatic WhatsApp notifications on status updates
- ✅ Incoming message webhook (customers can reply)
- ✅ Manual message sending via API
- ✅ Full conversation history tracking
- ✅ Clean architecture (Repository + Service + Controller pattern)

**Tech Stack:**

- Node.js + Express
- Prisma ORM + PostgreSQL/SQLite
- WhatsApp Cloud API (Meta)

---

## 🚀 Full Version Vision

**Planned Features:**

- 📊 **Web Dashboard** - React-based UI for device & message management
- 🔔 **Real-time Updates** - Socket.io for live notifications
- 📈 **Analytics** - Track repair times, customer satisfaction, revenue
- 🎨 **Custom Notifications** - Template system for personalized messages
- 📱 **Mobile App** - React Native for on-the-go management
- 🌍 **Multi-language** - Support for different locales
- 🏢 **Multi-tenant** - SaaS version for multiple repair shops
- 📧 **Email/SMS Fallback** - For non-WhatsApp customers
- 🔐 **Role-based Access** - Manager, technician, receptionist roles

---

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- WhatsApp Business Account
- Database (PostgreSQL/MySQL/SQLite)

### Installation

```bash
# Clone and install
git clone https://github.com/sickoovit/maintenotify.git
cd maintenotify
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npx prisma migrate dev
npx prisma generate

# Start server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="your_database_url"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_TOKEN="your_whatsapp_token"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your_verify_token"
PORT=3000
```

---

## 🔌 API Endpoints

### Devices

```
POST   /api/devices              # Create device (triggers notification)
GET    /api/devices              # Get all devices
PUT    /api/devices/:id/status   # Update status (triggers notification)
```

### Messages

```
POST   /api/messages/send                 # Send manual message
GET    /api/messages/conversations        # Get all conversations
GET    /api/messages/conversation/:id     # Get specific conversation
```

### Webhook

```
GET    /webhook/whatsapp    # Verify webhook
POST   /webhook/whatsapp    # Receive incoming messages
```

---

## 📁 Project Structure

```
src/
├── controllers/     # HTTP handlers
├── repositories/    # Database operations
├── services/        # Business logic
└── routes/          # API routes
```

Clean separation of concerns for scalability.

---

## 🗺️ Development Roadmap

- [x] **Phase 1:** Core API & WhatsApp integration
- [x] **Phase 2:** Two-way messaging & webhooks
- [x] **Phase 3:** Web dashboard (React)
- [ ] **Phase 4:** Real-time updates & analytics
- [ ] **Phase 5:** Mobile app
- [ ] **Phase 6:** Multi-tenant SaaS

**Current Status:** Phase 3 Complete ✅

---

## 🤝 Contributing

Built for repair shops by a repair shop manager. Contributions, issues, and feature requests are welcome!

---

## 📝 License

MIT License

---

**Made with ❤️ to solve real repair shop problems**
