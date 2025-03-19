import { createSlice } from "@reduxjs/toolkit";


const instructorSlice = createSlice({
    name: "instructorSlice",
    initialState: {
      courses: [],
      totalCourses: 0,
      totalPages: 0,
      currentPage: 1,
      isLoading: false,
      error: null,
    },
    reducers: {
      fetchCoursesStart(state) {
        state.isLoading = true;
        state.error = null;
      },
      fetchCoursesSuccess(state, action) {
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.totalCourses = action.payload.totalCourses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      },
      fetchCoursesFailure(state, action) {
        state.isLoading = false;
        state.error = action.payload;
      },
      setCurrentPage(state, action) {
        state.currentPage = action.payload;
      },
      addCourseSuccess(state, action) {
        console.log(action.payload);
        state.isLoading = false;
        state.courses.push(action.payload);
        state.totalCourses += 1;
        state.totalPages = Math.ceil(state.totalCourses / 10);
      },
      setCourseData(state, action) {
        const { courseId, sections } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          course.sections = sections;
        } else {
          state.courses.push({ _id: courseId, sections });
        }
      },
      addSectionToCourse(state, action) {
        const { courseId, section } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          course.sections = [...course.sections, section];
        }
      },
      addItemToSection(state, action) {

        const { courseId, sectionId, item } = action.payload
        const courseIndex = state.courses.findIndex(course => course._id === courseId)

        if (courseIndex !== -1) {

          const sectionIndex = state.courses[courseIndex].sections.findIndex(section => section._id === sectionId)

          if (sectionIndex !== -1) {

            // If the item already exists, replace it; otherwise, add the new item
            const itemIndex = state.courses[courseIndex].sections[sectionIndex].items.findIndex(existingItem => existingItem._id === item._id)

            if (itemIndex !== -1) {
              state.courses[courseIndex].sections[sectionIndex].items[itemIndex] = item;
            } else {
              state.courses[courseIndex].sections[sectionIndex].items.push(item);
            }
            
          }
        }
      },
      renameItemInSection(state, action) {
        const { courseId, sectionId, itemId, newName } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          const section = course.sections.find(section => section._id === sectionId);
          if (section) {
            const item = section.items.find(item => item._id === itemId);
            if (item) {
              item.name = newName;
            }
          }
        }
      },
      renameSection(state, action) {
        const { courseId, sectionId, newName } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          const section = course.sections.find(section => section._id === sectionId);
          if (section) {
            section.name = newName;
          }
        }
      },
      addAttachmentToItem(state, action) {
        const { courseId, sectionId, itemId, attachment } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          const section = course.sections.find(section => section._id === sectionId);
          if (section) {
            const item = section.items.find(item => item._id === itemId);
            if (item) {
              item.attachments.push(attachment);
            }
          }
        }
      },
      deleteSection(state , action) {
        const { courseId, sectionId } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          course.sections = course.sections.filter(section => section._id !== sectionId);
        }
      },
      deleteItem(state , action) {
        console.log(action.payload);
        const { courseId, sectionId, itemId } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          const section = course.sections.find(section => section._id === sectionId);
          if (section) {
            section.items = section.items.filter(item => item._id !== itemId);
          }
        }
      },
      deleteAttachmentFromItem(state , action) {
        const { courseId, sectionId, itemId, attachmentId } = action.payload;
        const course = state.courses.find(course => course._id === courseId);
        if (course) {
          const section = course.sections.find(section => section._id === sectionId);
          if (section) {
            const item = section.items.find(item => item._id === itemId);
            if (item) {
              item.attachments = item.attachments.filter(attachment => attachment._id !== attachmentId);
            }
          }
        }
      },
    },
})




export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  setCurrentPage,
  addCourseSuccess,
  addSectionToCourse,
  addItemToSection,
  renameItemInSection,
  renameSection,
  addAttachmentToItem,
  deleteSection,
  deleteItem,
  setCourseData,
  resetAttachment,
  deleteAttachmentFromItem
} = instructorSlice.actions


export { instructorSlice }