import { createRefractionLesson } from '../shared/refraction-lesson.js'
const dispose = await createRefractionLesson()
import.meta.hot?.dispose(dispose)
