
import React, { useState, useCallback, useEffect, ReactNode, Component, ErrorInfo } from 'react';
import { TokenizationState, Project, TokenizationCategory } from './types';
import { DeployView } from './components/DeployView';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { WizardPage } from './pages/WizardPage';
import { CategoryPage } from './pages/CategoryPage';
import { GenericPage } from './pages/GenericPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { EducationPage } from './pages/EducationPage';
import { supabase } from './lib/supabase';

// --- CONFIG & MOCK DATA ---

const INITIAL_PROJECTS: Project[] = [
  { 
    id: '1', 
    title: 'Skyline Tower A', 
    category: 'Real Estate', 
    valuation: 15000000, 
    status: 'Live', 
    progress: 85, 
    imageColor: 'bg-indigo-500', 
    lastUpdated: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'A premium Grade-A office tower located in the heart of the financial district. Fully leased to AAA tenants with a 5-year WALT.',
    location: 'New York, NY',
    apy: '8.2',
    minTicket: 1000,
    targetRaise: 15000000
  },
  { 
    id: '2', 
    title: 'TechFlow SaaS', 
    category: 'Business', 
    valuation: 5000000, 
    status: 'Deploying', 
    progress: 40, 
    imageColor: 'bg-emerald-500', 
    lastUpdated: '1d ago',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    description: 'Series A equity round for a high-growth B2B SaaS platform automating logistics workflows.',
    location: 'Austin, TX',
    apy: 'N/A', // Growth equity
    minTicket: 5000,
    targetRaise: 2000000
  },
  { 
    id: '3', 
    title: 'Warhol Collection', 
    category: 'Art', 
    valuation: 2500000, 
    status: 'Draft', 
    progress: 10, 
    imageColor: 'bg-rose-500', 
    lastUpdated: '3d ago',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c23?auto=format&fit=crop&w=800&q=80',
    description: 'Fractional ownership of a curated collection of Pop Art masterpieces, insured and stored in a Geneva freeport.',
    location: 'Geneva, CH',
    apy: '12.5',
    minTicket: 500,
    targetRaise: 2500000
  },
];

const INITIAL_STATE: TokenizationState = {
  projectInfo: {
    projectName: '',
    projectGoal: 'Capital Raise',
    assetClass: 'Real Estate',
    targetRaiseAmount: 0,
    description: '',
    website: ''
  },
  jurisdiction: { 
    country: '', 
    region: '', 
    spvType: '', 
    regulatoryRegime: '',
    entityDetails: { companyName: '', directors: [], shareholders: [], shareCapital: 0, registeredAddress: '' }
  },
  asset: { 
    category: 'Real Estate', 
    assetName: '', 
    valuation: 0, 
    currency: 'USD',
    financials: {
      appraisalValue: 0
    },
    images: []
  },
  compliance: { 
    kycProvider: '', 
    accreditationRequired: false, 
    amlCheckEnabled: true, 
    jurisdictionRestrictions: [],
    regFramework: 'None',
    retentionPolicy: '5 Years',
    whitelistingMode: 'Pre-Trade'
  },
  tokenomics: { 
    tokenName: '', 
    tokenSymbol: '', 
    totalSupply: 0, 
    pricePerToken: 0, 
    hardCap: 0, 
    softCap: 0, 
    lockupPeriodMonths: 12,
    vestingSchedule: 'None',
    dividendPolicy: 'None',
    votingRights: false,
    allocation: {
      founders: 0,
      investors: 0,
      treasury: 0,
      advisors: 0
    }
  },
  distribution: { targetInvestorType: 'Accredited', minInvestment: 5000, maxInvestment: 0, marketingChannels: [] }
};

// Pure Routing State
type AppRoute = 
  | 'HOME'            // Landing Page (Public)
  | 'EDUCATION'       // New Education Center (Public)
  | 'SOLUTIONS'       // Static Page
  | 'MARKETPLACE'     // Static Page (Now acts as Projects Viewer)
  | 'DEVELOPERS'      // Static Page
  | 'PRICING'         // Static Page
  | 'PROJECTS'        // New Public Projects Gallery
  | 'PROJECT_DETAILS' // Single Project View (New)
  | 'SIM_INTRO'       // Category Selection (Public - Standalone)
  | 'SIM_WIZARD'      // The actual steps (Public - Standalone)
  | 'SIM_DEPLOY'      // Blockchain Simulation (Public - Standalone)
  | 'SIM_AUTH'        // Gate before Dashboard (Private Transition)
  | 'DASHBOARD';      // Authenticated Area (Private)

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-xl border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-red-700 mb-2">Application Error</h1>
            <p className="text-slate-600 mb-6 text-sm">We encountered an unexpected issue. Please reload the simulator.</p>
            <details className="text-left text-xs text-red-400 bg-red-50 p-3 rounded mb-6 overflow-auto max-h-32">
                {this.state.error?.message}
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

function AppContent() {
  const [route, setRoute] = useState<AppRoute>('HOME');
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<TokenizationState>(INITIAL_STATE);
  const [isStepValid, setIsStepValid] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Check for active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // User is logged in
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && route === 'SIM_AUTH') {
        setRoute('DASHBOARD');
      }
    });

    return () => subscription.unsubscribe();
  }, [route]);

  // Data Manager
  const updateData = useCallback((section: keyof TokenizationState, payload: any) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...payload } }));
  }, []);

  // --- NAVIGATION ACTIONS ---

  // 1. Start Flow from Home
  const handleStartSimulation = () => {
    setData(INITIAL_STATE); // Reset state for new sim
    setRoute('SIM_INTRO');
  };

  const handleLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setRoute('DASHBOARD');
    } else {
      setRoute('SIM_AUTH'); 
    }
  };

  // 2. Category Selected -> Go to Wizard
  const handleCategorySelect = (category: TokenizationCategory) => {
    setData(prev => ({ ...prev, asset: { ...prev.asset, category } }));
    setCurrentStep(0);
    setRoute('SIM_WIZARD');
  };

  // 3. Wizard Navigation
  const handleWizardNext = () => {
    if (currentStep < 6) { 
      setCurrentStep(prev => prev + 1);
      setIsStepValid(false); 
    } else {
      setRoute('SIM_DEPLOY');
    }
  };

  const handleWizardBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsStepValid(true);
    } else {
      setRoute('SIM_INTRO');
    }
  };

  // 4. Simulation Completion
  const handleDeployComplete = () => {
    // Construct rich project object from wizard data
    const newProject: Project = {
      id: Math.random().toString(),
      title: data.projectInfo.projectName || data.asset.assetName || 'New Tokenized Asset',
      category: data.asset.category,
      valuation: data.asset.valuation || 1000000,
      status: 'Live',
      progress: 0, // Freshly launched
      imageColor: 'bg-brand-500', // fallback
      imageUrl: data.asset.images?.[0] || undefined, // Use first uploaded image
      lastUpdated: 'Just now',
      description: data.projectInfo.description,
      location: data.jurisdiction.entityDetails.registrationState || 'Global',
      apy: 'Pending',
      minTicket: data.distribution.minInvestment,
      targetRaise: data.projectInfo.targetRaiseAmount || data.asset.valuation
    };
    
    setProjects(prev => [newProject, ...prev]);
    // Redirect to the Projects page to see it in the list
    setRoute('PROJECTS'); 
  };

  const handleAuthSuccess = () => {
    setRoute('DASHBOARD');
  };

  const handleDashboardCreateNew = () => {
    setData(INITIAL_STATE);
    setRoute('SIM_INTRO');
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRoute('HOME');
  }

  // Handle Project Selection
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setRoute('PROJECT_DETAILS');
  };

  const handleInvest = (amount: number) => {
    if (!selectedProject) return;
    alert(`Investment of $${amount} simulated for ${selectedProject.title}!`);
    // Update local state to show progress
    const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
            const newProgress = Math.min(100, p.progress + (amount / (p.targetRaise || p.valuation)) * 100);
            return { ...p, progress: newProgress };
        }
        return p;
    });
    setProjects(updatedProjects);
    // Update selected project view as well
    const updatedSelected = updatedProjects.find(p => p.id === selectedProject.id);
    if(updatedSelected) setSelectedProject(updatedSelected);
  };

  // --- VIEW RENDERING ---

  switch (route) {
    case 'HOME':
      return <HomePage onStartSimulation={handleStartSimulation} onLogin={handleLogin} onNavigate={(p) => setRoute(p as AppRoute)} />;
    
    // New Education Route
    case 'EDUCATION':
      return <EducationPage onBack={() => setRoute('HOME')} onStartSimulation={handleStartSimulation} />;

    // Static Pages
    case 'SOLUTIONS':
      return <GenericPage title="Solutions" subtitle="Enterprise-grade infrastructure for Real Estate syndicators and Private Equity funds." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;
    case 'MARKETPLACE':
       return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} onSelectProject={handleSelectProject} />;
    case 'PROJECTS':
       return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} onSelectProject={handleSelectProject} />;
    case 'PROJECT_DETAILS':
        if (!selectedProject) return <ProjectsPage projects={projects} onBack={() => setRoute('HOME')} onLogin={handleLogin} onSelectProject={handleSelectProject} />;
        return <ProjectDetailsPage project={selectedProject} onBack={() => setRoute('PROJECTS')} onInvest={handleInvest} />;
    case 'DEVELOPERS':
       return <GenericPage title="Developer API" subtitle="Integrate our compliance and settlement layer directly into your application." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;
    case 'PRICING':
       return <GenericPage title="Pricing" subtitle="Transparent pricing scaling with your Assets Under Management (AUM)." onBack={() => setRoute('HOME')} onCta={handleStartSimulation} />;

    case 'SIM_INTRO':
      return <CategoryPage onSelect={handleCategorySelect} onBack={() => setRoute('HOME')} />;

    case 'SIM_WIZARD':
      return (
        <WizardPage 
          currentStep={currentStep}
          data={data}
          isStepValid={isStepValid}
          onNext={handleWizardNext}
          onBack={handleWizardBack}
          updateData={updateData}
          setIsStepValid={setIsStepValid}
          onCancel={() => setRoute('HOME')}
        />
      );

    case 'SIM_DEPLOY':
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <DeployView onComplete={handleDeployComplete} />
        </div>
      );

    case 'SIM_AUTH':
      return <AuthModal onSuccess={handleAuthSuccess} />;

    case 'DASHBOARD':
      return (
        <DashboardPage 
          projects={projects} 
          onCreateNew={handleDashboardCreateNew} 
          onLogout={handleLogout}
        />
      );
    
    default:
      return <div>Error: Unknown Route</div>;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
