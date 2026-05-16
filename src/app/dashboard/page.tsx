"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/animations/page-transition";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, FileText, Mic, Target, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import React from "react";

export default function Dashboard() {
  const [userName, setUserName] = React.useState("User");
  const [stats, setStats] = React.useState({
    avgScore: 0,
    interviews: 0,
    readiness: "Low",
    growth: 0
  });
  const [activities, setActivities] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  
  const supabase = createClient();

  React.useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Set User Name
        const name = user.user_metadata?.full_name || user.user_metadata?.first_name || user.email?.split('@')[0] || "User";
        setUserName(name);

        // Fetch Analyses
        const { data: analyses } = await supabase
          .from("analyses")
          .select("*")
          .order("created_at", { ascending: true });

        // Fetch Interviews
        const { data: interviews } = await supabase
          .from("interviews")
          .select("*");

        if (analyses && analyses.length > 0) {
          const avg = Math.round(analyses.reduce((acc, curr) => acc + (curr.score || 0), 0) / analyses.length);
          const lastScore = analyses[analyses.length - 1].score;
          
          setStats({
            avgScore: avg,
            interviews: interviews?.length || 0,
            readiness: avg > 80 ? "High" : avg > 50 ? "Medium" : "Low",
            growth: analyses.length > 1 ? lastScore - analyses[0].score : 0
          });

          // Prepare Chart Data
          const chart = analyses.map((a, i) => ({
            name: `A${i + 1}`,
            score: a.score
          }));
          setChartData(chart);

          // Recent Activities
          const recent = analyses.slice(-5).reverse();
          setActivities(recent);
        }
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: "Avg. ATS Score", value: `${stats.avgScore}%`, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Mock Interviews", value: stats.interviews.toString(), icon: Mic, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Interview Readiness", value: stats.readiness, icon: Target, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Score Growth", value: `${stats.growth > 0 ? '+' : ''}${stats.growth}%`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <PageTransition>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 text-gradient">Welcome back, {userName}</h1>
          <p className="text-gray-400">Here's an overview of your career progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>ATS Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.5)' }} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: 'rgba(255,255,255,0.5)' }} 
                        axisLine={false} 
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No score data yet. Analyze your first resume!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Resume Analyzed</p>
                        <p className="text-xs text-gray-400">Score: {activity.score}% • {activity.level}</p>
                        <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mb-3 opacity-20" />
                    <p className="text-sm text-gray-500">No recent activity found.</p>
                    <p className="text-xs text-gray-600">Analyze a resume to see it here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
