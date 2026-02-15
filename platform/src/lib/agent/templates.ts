
export const LANDING_PAGE_TEMPLATE = `import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code2, Sparkles, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b py-4 px-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="bg-black text-white p-1 rounded-lg">
             <Code2 className="w-5 h-5" />
           </div>
           <span className="font-bold text-xl tracking-tight">Olynero</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm rounded-full flex gap-2 items-center">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>New: AI-Powered Coding Agent</span>
        </Badge>
        
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Build software <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">at the speed of thought.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Olynero is the first AI platform that understands your intent and builds production-ready applications in seconds. No more boilerplate.
        </p>
        
        <div className="flex gap-4">
          <Button size="lg" className="gap-2 h-12 px-8 text-base">
            Start Building <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base">
            View Documentation
          </Button>
        </div>
        
        {/* Metric Cards */}
        <div className="mt-20 grid grid-cols-3 gap-8 w-full">
            {[
                { label: "Code Accuracy", value: "99.9%", icon: Sparkles },
                { label: "Generation Speed", value: "< 2s", icon: Zap },
                { label: "Components", value: "50+", icon: Code2 },
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl border bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-slate-500 font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}`;

export const DASHBOARD_TEMPLATE = `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Search, 
  Bell, 
  Home,
  LogOut,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const stats = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: DollarSign },
    { title: "Subscriptions", value: "+2350", change: "+180.1%", icon: Users },
    { title: "Sales", value: "+12,234", change: "+19%", icon: TrendingUp },
    { title: "Active Now", value: "+573", change: "+201 since last hour", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <span className="font-bold text-xl">Olynero</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {[
                { name: 'Dashboard', icon: LayoutDashboard },
                { name: 'Analytics', icon: BarChart3 },
                { name: 'Customers', icon: Users },
                { name: 'Settings', icon: Settings },
            ].map((item) => (
                <Button 
                    key={item.name}
                    variant={activeTab === item.name ? "secondary" : "ghost"} 
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => setActiveTab(item.name)}
                >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                </Button>
            ))}
        </nav>
        
        <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                Sign Out
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search..." className="pl-9 bg-slate-50 border-none" />
                </div>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className={stat.change.includes('+') ? "text-green-500" : "text-red-500"}>
                                    {stat.change}
                                </span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div className="grid grid-cols-2 gap-8">
                <Card className="col-span-1 h-96">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>Monthly revenue analytics.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-full pb-10">
                         <div className="text-slate-400">Chart Placeholder</div>
                    </CardContent>
                </Card>
                <Card className="col-span-1 h-96">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                         <CardDescription>Latest transaction history.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex items-center justify-center h-full pb-10">
                         <div className="text-slate-400">List Placeholder</div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}`;
