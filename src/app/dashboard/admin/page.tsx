"use client";

import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">HR/Admin Dashboard</h1>
        <p className="text-gray-400">Overview of candidates, resume metrics, and platform usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Candidates", value: "1,284", icon: Users, color: "text-blue-400" },
          { title: "Resumes Processed", value: "3,492", icon: FileText, color: "text-purple-400" },
          { title: "Avg. Match Score", value: "76%", icon: Activity, color: "text-green-400" },
        ].map((stat, i) => (
          <Card key={i} className="glass">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Candidates</CardTitle>
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input type="text" placeholder="Search candidates..." className="pl-10 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-white/5 text-gray-300">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Name</th>
                  <th className="px-6 py-3">Role Applied</th>
                  <th className="px-6 py-3">Match Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sarah Jenkins", role: "Frontend Developer", score: 92, status: "Interviewed" },
                  { name: "Michael Chen", role: "Product Manager", score: 85, status: "Screening" },
                  { name: "Emily Rodriguez", role: "UX Designer", score: 78, status: "Rejected" },
                  { name: "David Kim", role: "Backend Engineer", score: 95, status: "Offered" },
                ].map((candidate, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{candidate.name}</td>
                    <td className="px-6 py-4">{candidate.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-white/10 rounded-full h-1.5 max-w-[60px]">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${candidate.score}%` }}></div>
                        </div>
                        <span className="text-xs">{candidate.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'Offered' ? 'bg-green-500/10 text-green-400' :
                        candidate.status === 'Interviewed' ? 'bg-blue-500/10 text-blue-400' :
                        candidate.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary-hover font-medium">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
