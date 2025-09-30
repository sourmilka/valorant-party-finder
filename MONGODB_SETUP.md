# MongoDB Setup Guide

## 🚀 **Quick Setup - MongoDB Atlas (Recommended)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Build a new app" when prompted

### **Step 2: Create a Free Cluster**
1. **Choose Plan**: Select "M0 Sandbox" (Free tier)
2. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
3. **Region**: Select the region closest to you
4. **Cluster Name**: Keep default or change to "valorant-cluster"
5. Click **"Create Cluster"**

### **Step 3: Set Up Database Access**
1. Go to **"Database Access"** in the left menu
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `valorant-user` (or your choice)
5. **Password**: Create a strong password (save this!)
6. **Database User Privileges**: "Read and write to any database"
7. Click **"Add User"**

### **Step 4: Set Up Network Access**
1. Go to **"Network Access"** in the left menu
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### **Step 5: Get Your Connection String**
1. Go to **"Database"** in the left menu
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**

**Your connection string will look like:**
```
mongodb+srv://valorant-user:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### **Step 6: Update Your Environment File**
Create a `.env.local` file in your project root:

```env
MONGODB_URI=mongodb+srv://valorant-user:yourpassword@cluster0.xxxxx.mongodb.net/valorant-party-finder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

**Important**: Replace `yourpassword` with the actual password you created in Step 3!

## 🔧 **Alternative: Local MongoDB Installation**

### **Windows:**
1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer with default settings
3. Start MongoDB service
4. Your MONGODB_URI: `mongodb://localhost:27017/valorant-party-finder`

### **macOS:**
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Your MONGODB_URI: mongodb://localhost:27017/valorant-party-finder
```

### **Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Your MONGODB_URI: mongodb://localhost:27017/valorant-party-finder
```

## 🐳 **Docker Option (Quick Setup)**
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Your MONGODB_URI: mongodb://localhost:27017/valorant-party-finder
```

## ✅ **Test Your Connection**

1. **Create `.env.local`** with your MONGODB_URI
2. **Start the development server**: `npm run dev`
3. **Check the console**: Should see "Connected to MongoDB" message
4. **Test the website**: Go to [http://localhost:3000](http://localhost:3000)

## 🆘 **Troubleshooting**

### **Connection Issues:**
- **Check your MONGODB_URI**: Make sure it's correct
- **Verify password**: Ensure the password in the URI matches your database user
- **Check network access**: Make sure your IP is allowed (for Atlas)
- **Test connection**: Try connecting with MongoDB Compass

### **Common Errors:**
- **"Authentication failed"**: Wrong username/password
- **"Connection refused"**: MongoDB service not running
- **"Network timeout"**: Firewall or network issues

### **Still Having Issues?**
1. **Double-check your MONGODB_URI** format
2. **Verify MongoDB is running** (for local installation)
3. **Check Atlas cluster status** (for cloud)
4. **Try a different region** (for Atlas)

## 🎯 **Next Steps**

Once MongoDB is connected:
1. **Register an account** on your website
2. **Create party invitations**
3. **Post LFG requests**
4. **Test all features**

Your Valorant Party Finder will now have full database functionality! 🎮
