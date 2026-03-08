import { Module } from '@nestjs/common';

import { ProjectsSubmoduleModule } from './projects/projects-submodule.module';

@Module({
  imports: [ProjectsSubmoduleModule],
})
export class ProjectsModule {}
