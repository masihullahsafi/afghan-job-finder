import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JobListings } from './pages/JobListings';
import { JobDetail } from './pages/JobDetail';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { SavedJobs } from './pages/SavedJobs';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { SalaryCalculator } from './pages/SalaryCalculator';
import { SkillAssessment } from './pages/SkillAssessment';
import { Messages } from './pages/Messages';
import { PublicProfile } from './pages/PublicProfile';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { SalaryExplorer } from './pages/SalaryExplorer';
import { Events } from './pages/Events';

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