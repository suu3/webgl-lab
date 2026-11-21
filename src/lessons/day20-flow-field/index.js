import { createFieldLesson } from '../shared/field-lesson.js'
const dispose = await createFieldLesson(20)
import.meta.hot?.dispose(dispose)
