/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { readSchedulerServiceTaskScheduleDefinitionFromConfig } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { GiteaProviderConfig } from './types';

function readGiteaConfig(id: string, config: Config): GiteaProviderConfig {
  const branch = config.getOptionalString('branch') ?? 'main';
  const catalogPath =
    config.getOptionalString('catalogPath') ?? 'catalog-info.yaml';
  const host = config.getString('host');
  const organization = config.getString('organization');

  const schedule = config.has('schedule')
    ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
        config.getConfig('schedule'),
      )
    : undefined;

  return {
    branch,
    catalogPath,
    host,
    id,
    schedule,
    organization,
  };
}

export function readGiteaConfigs(config: Config): GiteaProviderConfig[] {
  const configs: GiteaProviderConfig[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.gitea');

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readGiteaConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}
