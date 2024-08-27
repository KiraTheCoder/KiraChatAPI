import { AllMainRoutes } from '@src/routes'
import Express from 'express'

export const configureRoutes = (app:Express.Application) => {
    app.use('/', AllMainRoutes);
}