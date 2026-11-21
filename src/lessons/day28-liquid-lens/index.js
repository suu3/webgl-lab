import { createRefractionLesson } from '../shared/refraction-lesson.js'
const dispose = await createRefractionLesson({ edge: true })
import.meta.hot?.dispose(dispose)
