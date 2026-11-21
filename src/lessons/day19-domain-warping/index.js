import { createFieldLesson } from '../shared/field-lesson.js'
const dispose = await createFieldLesson(19)
import.meta.hot?.dispose(dispose)
