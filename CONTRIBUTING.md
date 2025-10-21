# 🤝 Contributing to VALORANT Party Finder

<div align="center">

![VALORANT](https://img.shields.io/badge/VALORANT-FF4654?style=for-the-badge&logo=riot-games&logoColor=white)
![Contributors Welcome](https://img.shields.io/badge/Contributors-Welcome-FF4654?style=for-the-badge)

**Thank you for your interest in contributing to the VALORANT Party Finder!**

*Every contribution helps make the VALORANT community stronger* 🎯

</div>

## 🎮 **About This Project**

VALORANT Party Finder is a community-driven platform that helps VALORANT players find teammates, create parties, and improve their competitive experience. We welcome contributions from developers, designers, and VALORANT enthusiasts of all skill levels.

## 🚀 **Getting Started**

### 📋 **Prerequisites**

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** for version control
- **MongoDB** (local or Atlas)
- Basic knowledge of **React/Next.js**
- Understanding of **VALORANT** gameplay and terminology

### ⚡ **Quick Setup**

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/valorant-party-finder.git
cd valorant-party-finder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev
```

## 🎯 **Ways to Contribute**

### 🐛 **Bug Reports**
Found a bug? Help us fix it!
- Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include steps to reproduce
- Add screenshots if applicable
- Specify your environment (OS, browser, etc.)

### ✨ **Feature Requests**
Have an idea for improvement?
- Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the VALORANT context
- Describe the expected user experience
- Consider technical feasibility

### 💻 **Code Contributions**
Ready to code? Here's how:

#### **🔍 Finding Issues to Work On**
- Look for issues labeled `good first issue` for beginners
- Check `help wanted` for issues needing contributors
- Browse `enhancement` for feature development
- Ask questions in issue comments before starting

#### **🌿 Development Workflow**
1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow our coding standards
   - Write clear commit messages
   - Test your changes thoroughly

3. **Submit a Pull Request**
   - Use our [PR Template](.github/pull_request_template.md)
   - Link related issues
   - Add screenshots/videos for UI changes

## 📝 **Coding Standards**

### **🎨 Code Style**
- **TypeScript** for type safety
- **ESLint** and **Prettier** for formatting
- **Tailwind CSS** for styling
- **Descriptive variable names** (e.g., `userRank`, `partyCode`)

### **📁 File Organization**
```
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   └── (pages)/        # Page components
├── components/         # Reusable React components
├── lib/               # Utility functions
├── models/            # Database models
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

### **🎯 VALORANT-Specific Guidelines**
- Use official VALORANT terminology
- Follow Riot Games' design principles
- Respect rank hierarchy and game mechanics
- Include proper agent/role references

## 🧪 **Testing Guidelines**

### **✅ Before Submitting**
- [ ] Code compiles without errors
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] UI works on mobile and desktop
- [ ] VALORANT-specific features work correctly

### **🔍 Testing Checklist**
- **Authentication**: Login/logout flows
- **Party Creation**: All form fields and validation
- **LFG System**: Search and filtering
- **Responsive Design**: Mobile, tablet, desktop
- **Cross-browser**: Chrome, Firefox, Safari, Edge

## 🎨 **Design Contributions**

### **🖼️ UI/UX Improvements**
- Follow VALORANT's visual design language
- Use the official color palette (red #FF4654, etc.)
- Maintain consistency with game UI elements
- Consider accessibility (contrast, font sizes)

### **📱 Responsive Design**
- Mobile-first approach
- Test on various screen sizes
- Ensure touch-friendly interactions
- Optimize for performance

## 🔐 **Security Guidelines**

### **🛡️ Security Best Practices**
- Never commit sensitive data (API keys, passwords)
- Validate all user inputs
- Use proper authentication checks
- Follow OWASP security guidelines
- Report security issues privately

### **📊 Performance Considerations**
- Optimize database queries
- Minimize bundle size
- Use proper caching strategies
- Consider mobile performance

## 📋 **Pull Request Process**

### **🔄 PR Requirements**
1. **Clear Description**: What does this PR do?
2. **Issue Reference**: Link to related issues
3. **Testing**: Describe how you tested changes
4. **Screenshots**: For UI changes
5. **Breaking Changes**: Document any breaking changes

### **👀 Review Process**
1. **Automated Checks**: CI/CD must pass
2. **Code Review**: At least one maintainer review
3. **Testing**: Manual testing by reviewers
4. **Approval**: Required before merging

## 🏆 **Recognition**

### **🌟 Contributor Levels**
- **🥉 Bronze**: First contribution merged
- **🥈 Silver**: 5+ contributions merged
- **🥇 Gold**: 15+ contributions merged
- **💎 Diamond**: Significant feature contributions
- **⚡ Radiant**: Core maintainer status

### **📈 Contribution Types**
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation
- 🎨 Design improvements
- 🧪 Testing
- 🔧 Infrastructure

## 📞 **Getting Help**

### **💬 Communication Channels**
- **GitHub Issues**: For bugs and features
- **GitHub Discussions**: For questions and ideas
- **Discord**: [Join our community](https://discord.gg/your-discord)
- **Email**: [maintainers@example.com](mailto:maintainers@example.com)

### **❓ Common Questions**

**Q: I'm new to open source. Where should I start?**
A: Look for issues labeled `good first issue` and don't hesitate to ask questions!

**Q: Can I work on multiple issues at once?**
A: We recommend focusing on one issue at a time to ensure quality.

**Q: How long does review take?**
A: We aim to review PRs within 48-72 hours.

**Q: Can I contribute without coding?**
A: Absolutely! We need help with documentation, design, testing, and community management.

## 📄 **Code of Conduct**

### **🤝 Our Pledge**
We are committed to making participation in our project a harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, nationality
- Personal appearance, race, religion
- Sexual identity and orientation

### **⚖️ Our Standards**
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## 🙏 **Thank You**

<div align="center">

**Your contributions make the VALORANT community stronger!**

Every bug report, feature suggestion, code contribution, and community interaction helps create a better experience for VALORANT players worldwide.

*"The best way to take a site is together."* - Brimstone

---

**Ready to contribute?** 
[🍴 Fork the repository](../../fork) • [📋 Browse issues](../../issues) • [💬 Join discussions](../../discussions)

</div>
