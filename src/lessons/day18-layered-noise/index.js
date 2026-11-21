import { createFieldLesson } from '../shared/field-lesson.js'
const dispose = await createFieldLesson(18)
import.meta.hot?.dispose(dispose)
