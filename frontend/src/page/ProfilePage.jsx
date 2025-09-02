import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Shield, 
  Trophy, 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader
} from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { playlists, getAllPlaylists, isLoading: playlistsLoading } = usePlaylistStore();
  const { solvedProblems, getSolvedProblemByUser, isProblemsLoading } = useProblemStore();
  
  const [solvedStats, setSolvedStats] = useState({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
    total: 0
  });

  useEffect(() => {
    getAllPlaylists();
    getSolvedProblemByUser();
  }, [getAllPlaylists, getSolvedProblemByUser]);

  useEffect(() => {
    if (solvedProblems.length > 0) {
      const stats = solvedProblems.reduce((acc, problem) => {
        acc[problem.difficulty]++;
        acc.total++;
        return acc;
      }, { EASY: 0, MEDIUM: 0, HARD: 0, total: 0 });
      setSolvedStats(stats);
    }
  }, [solvedProblems]);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-base-content/70">Welcome back, {authUser.name}!</p>
        </div>

        {/* User Info Card */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full">
                  <img
                    src={authUser.image || "https://avatar.iran.liara.run/public/boy"}
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">{authUser.name}</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{authUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="badge badge-primary">{authUser.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solved Problems Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="card-title text-lg justify-center">Total Solved</h3>
              <p className="text-3xl font-bold text-primary">{solvedStats.total}</p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="card-title text-lg justify-center">Easy</h3>
              <p className="text-3xl font-bold text-success">{solvedStats.EASY}</p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="card-title text-lg justify-center">Medium</h3>
              <p className="text-3xl font-bold text-warning">{solvedStats.MEDIUM}</p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="card-title text-lg justify-center">Hard</h3>
              <p className="text-3xl font-bold text-error">{solvedStats.HARD}</p>
            </div>
          </div>
        </div>

        {/* User Playlists */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              My Playlists
            </h2>
            
            {playlistsLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No playlists created yet.</p>
                <p className="text-sm">Create your first playlist to organize problems!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="card bg-base-200 shadow-md">
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{playlist.name}</h3>
                          {playlist.description && (
                            <p className="text-base-content/70 mt-1">{playlist.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="badge badge-primary">
                          {playlist.problems?.length || 0} problems
                        </span>
                      </div>
                      
                      {/* Problems in this playlist */}
                      {playlist.problems && playlist.problems.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-base-content/80">Problems:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {playlist.problems.map(({ problem }) => (
                              <Link
                                key={problem.id}
                                to={`/problem/${problem.id}`}
                                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="card-body p-4">
                                  <h5 className="font-semibold text-sm line-clamp-2">{problem.title}</h5>
                                  <div className="flex items-center justify-between mt-2">
                                    <span
                                      className={`badge text-xs font-semibold text-white ${
                                        problem.difficulty === "EASY"
                                          ? "badge-success"
                                          : problem.difficulty === "MEDIUM"
                                          ? "badge-warning"
                                          : "badge-error"
                                      }`}
                                    >
                                      {problem.difficulty}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {(problem.tags || []).slice(0, 2).map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="badge badge-outline badge-warning text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-base-content/60">
                          <p>No problems in this playlist yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 