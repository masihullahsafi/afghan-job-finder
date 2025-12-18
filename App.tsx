import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { JobListings } from './pages/JobListings.tsx';
import { JobDetail } from './pages/JobDetail.tsx';
import { EmployerDashboard } from './pages/EmployerDashboard.tsx';
import { SeekerDashboard } from './pages/SeekerDashboard.tsx';
import { Auth } from './pages/Auth.tsx';
import { AdminLogin } from './pages/AdminLogin.tsx';
import { Companies } from './pages/Companies.tsx';
import { CompanyDetail } from './pages/CompanyDetail.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { SavedJobs } from './pages/SavedJobs.tsx';
import { Contact } from './pages/Contact.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { Privacy } from './pages/Privacy.tsx';
import { Terms } from './pages/Terms.tsx';
import { Blog } from './pages/Blog.tsx';
import { BlogPost } from './pages/BlogPost.tsx';
import { FAQ } from './pages/FAQ.tsx';
import { About } from './pages/About.tsx';
import { SalaryCalculator } from './pages/SalaryCalculator.tsx';
import { SkillAssessment } from './pages/SkillAssessment.tsx';
import { Messages } from './pages/Messages.tsx';
import { PublicProfile } from './pages/PublicProfile.tsx';
import { Community } from './pages/Community.tsx';
import { Settings } from './pages/Settings.tsx';
import { SalaryExplorer } from './pages/SalaryExplorer.tsx';
import { Events } from './pages/Events.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/seeker" element={<SeekerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/tools/skills-assessment" element={<SkillAssessment />} />
            <Route path="/salaries" element={<SalaryExplorer />} />
            <Route path="/events" element={<Events />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  );
};

export default App;