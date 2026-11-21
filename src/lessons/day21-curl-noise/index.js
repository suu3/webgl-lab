import { createFieldLesson } from '../shared/field-lesson.js'
const dispose = await createFieldLesson(21)
import.meta.hot?.dispose(dispose)
