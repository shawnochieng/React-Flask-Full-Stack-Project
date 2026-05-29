import { useEffect, useState, useContext } from 'react';
import { courseService } from '../services/courseService';
import { AuthContext } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [activeTab, setActiveTab] = useState(user?.role === 'instructor' ? 'manage' : 'browse');
  const [loading, setLoading] = useState(true);

  // Form State for Creating/Updating
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const allData = await courseService.getAllCourses();
      setAllCourses(allData);

      if (user?.role === 'student') {
        const studentData = await courseService.getMyEnrolledCourses();
        setMyCourses(studentData);
      }
    } catch (err) {
      console.error('System synchronization issue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // --- STUDENT ACTIONS ---
  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      alert('Successfully joined the curriculum!');
      fetchDashboardData();
    } catch (err) {
      alert('Enrollment error.');
    }
  };

  // --- INSTRUCTOR CRUD ACTIONS ---
  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await courseService.updateCourse(editingCourseId, { title, description });
        alert('Course content successfully updated!');
      } else {
        await courseService.createCourse({ title, description });
        alert('New course successfully created!');
      }
      setTitle('');
      setDescription('');
      setEditingCourseId(null);
      fetchDashboardData();
    } catch (err) {
      alert('Action unauthorized or server error.');
    }
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setDescription(course.description);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course entirely?')) {
      try {
        await courseService.deleteCourse(id);
        alert('Course permanently removed.');
        fetchDashboardData();
      } catch (err) {
        alert('Delete failed. You may not be the owner.');
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Synchronizing workspace...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Dynamic Navigation Tabs based on Role */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        {user?.role === 'instructor' ? (
          <>
            <button onClick={() => setActiveTab('manage')} style={{ background: activeTab === 'manage' ? 'var(--accent)' : 'var(--code-bg)', color: activeTab === 'manage' ? 'var(--bg)' : 'var(--text-h)' }}>
              Manage Course Dashboard
            </button>
            <button onClick={() => setActiveTab('all-view')} style={{ background: activeTab === 'all-view' ? 'var(--accent)' : 'var(--code-bg)', color: activeTab === 'all-view' ? 'var(--bg)' : 'var(--text-h)' }}>
              View Public Catalog View
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('browse')} style={{ background: activeTab === 'browse' ? 'var(--accent)' : 'var(--code-bg)', color: activeTab === 'browse' ? 'var(--bg)' : 'var(--text-h)' }}>
              Browse Available Courses
            </button>
            <button onClick={() => setActiveTab('my-dashboard')} style={{ background: activeTab === 'my-dashboard' ? 'var(--accent)' : 'var(--code-bg)', color: activeTab === 'my-dashboard' ? 'var(--bg)' : 'var(--text-h)' }}>
              View Enrolled Dashboard ({myCourses.length})
            </button>
          </>
        )}
      </div>

      {/* ================= INSTRUCTOR VIEW: MANAGEMENT DESK ================= */}
      {activeTab === 'manage' && user?.role === 'instructor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

          {/* Create / Update Form */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', boxShadow: 'var(--shadow)' }}>
            <h2>{editingCourseId ? 'Edit Content' : 'Create New Course'}</h2>
            <form onSubmit={handleCreateOrUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
              <input type="text" placeholder="Course Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <textarea placeholder="Course Description" value={description} onChange={e => setDescription(e.target.value)} required
                style={{ width: '100%', padding: '12px', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-h)', height: '120px', resize: 'none', outline: 'none' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: 'var(--accent)', color: 'var(--bg)' }}>
                  {editingCourseId ? 'Save Changes' : 'Publish Course'}
                </button>
                {editingCourseId && (
                  <button type="button" onClick={() => { setEditingCourseId(null); setTitle(''); setDescription(''); }} style={{ background: '#777', color: '#fff' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Courses List with Update and Delete Controls */}
          <div>
            <h2>Your Active Class List</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {allCourses.filter(c => c.instructor === user.username).map(c => (
                <div key={c.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{c.title}</h3>
                    <p style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{c.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditClick(c)} style={{ background: 'var(--accent-bg)', color: 'var(--accent)', padding: '6px 12px', fontSize: '0.85rem' }}>Edit</button>
                    <button onClick={() => handleDeleteCourse(c.id)} style={{ background: '#ff4d4d', color: '#fff', padding: '6px 12px', fontSize: '0.85rem' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= PUBLIC CATALOG / VISITOR TAB ================= */}
      {(activeTab === 'browse' || activeTab === 'all-view') && (
        <div>
          <h1>Global Course Catalog</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {allCourses.map(c => {
              const isAlreadyEnrolled = myCourses.some(myCourse => myCourse.id === c.id);
              return (
                <div key={c.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h2>{c.title}</h2>
                    <p style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>{c.description}</p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.8rem' }}>By: {c.instructor}</code>
                    {user?.role === 'student' && (
                      <button onClick={() => handleEnroll(c.id)} disabled={isAlreadyEnrolled} style={{ background: isAlreadyEnrolled ? 'var(--border)' : 'var(--accent-bg)', color: isAlreadyEnrolled ? 'var(--text)' : 'var(--accent)' }}>
                        {isAlreadyEnrolled ? 'Joined' : 'Enroll'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STUDENT PERSONAL DASHBOARD TAB ================= */}
      {activeTab === 'my-dashboard' && user?.role === 'student' && (
        <div>
          <h1>My Enrolled Tracks</h1>
          {myCourses.length === 0 ? (
            <p style={{ marginTop: '1.5rem', color: 'var(--text)' }}>You have not enrolled in any tracks yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {myCourses.map(c => (
                <div key={c.id} style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h2>{c.title}</h2>
                    <p style={{ color: 'var(--text)', marginBottom: '1rem' }}>{c.description}</p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>By: {c.instructor}</span>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to drop out of ${c.title}?`)) {
                          try {
                            await courseService.unenrollFromCourse(c.id);
                            alert('Successfully unenrolled from track.');
                            fetchDashboardData(); // Hot reload the lists
                          } catch (err) {
                            alert('Unenrollment action rejected.');
                          }
                        }
                      }}
                      style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 12px', fontSize: '0.85rem' }}>
                      Drop Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}



    </div>
  );
};
