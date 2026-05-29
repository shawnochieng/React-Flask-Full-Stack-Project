import API from './api';

export const courseService = {
    // 1. Fetch all available courses from the database matrix (Open Access)
    getAllCourses: async () => {
        const response = await API.get('/courses');
        return response.data;
    },

    // 2. Commit a new course entity track to the system (Instructor Restricted)
    createCourse: async (courseData) => {
        const response = await API.post('/courses', courseData);
        return response.data;
    },

    // 3. Apply updates to an existing course row record (Instructor Restricted)
    updateCourse: async (id, courseData) => {
        const response = await API.put(`/courses/${id}`, courseData);
        return response.data;
    },

    // 4. Wipe a course track entirely from the system records (Instructor Restricted)
    deleteCourse: async (id) => {
        const response = await API.delete(`/courses/${id}`);
        return response.data;
    },

    // 5. Enroll student in a targeted course ID
    enrollInCourse: async (id) => {
        const response = await API.post(`/courses/${id}/enroll`);
        return response.data;
    },

    // 6. Fetch only the courses the logged-in student has joined
    getMyEnrolledCourses: async () => {
        const response = await API.get('/student/my-courses');
        return response.data;
    },
    
    // 7. Remove student from a targeted course ID
    unenrollFromCourse: async (id) => {
        const response = await API.post(`/courses/${id}/unenroll`);
        return response.data;
    }


};
