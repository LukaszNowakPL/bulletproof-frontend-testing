// Indication for Lighthouse audit to make tests fail if any metric score below given level
// The expected set for production apps should be 100 everywhere
export const LIGHTHOUSE_SNAPSHOT_THRESHOLDS = {'best-practices': 100, accessibility: 90, seo: 50};

// Subfolder to snapshotPathTemplate part of Playwright config setting. Directory for aria static snapshots
export const ARIA_SNAPSHOTS_DIRECTORY = 'aria';

// Subfolder to snapshotPathTemplate part of Playwright config setting. Directory for visual snapshots
export const VISUAL_SNAPSHOTS_DIRECTORY = 'visual';

// Docker host used on tests performed locally
export const DOCKER_HOST = 'host.docker.internal';
