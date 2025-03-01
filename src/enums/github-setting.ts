const themesValue =   ['algolia', 'ambient_gradient', 'apprentice', 'aura', 'aura_dark', 'ayu-mirage', 'bear', 'blue-green', 'blue_navy', 'blueberry', 'buefy', 'calm', 'calm_pink', 'catppuccin_latte', 'catppuccin_mocha', 'chartreuse-dark', 'city_lights', 'cobalt', 'cobalt2', 'codeSTACKr', 'darcula', 'dark', 'date_night', 'default', 'default_repocard', 'discord_old_blurple', 'dracula', 'flag-india', 'github_dark', 'github_dark_dimmed', 'gotham', 'graywhite', 'great-gatsby', 'gruvbox', 'gruvbox_light', 'highcontrast', 'holi', 'jolly', 'kacho_ga', 'maroongold', 'material-palenight', 'merko', 'midnight-purple', 'moltack', 'monokai', 'neon', 'nightowl', 'noctis_minimus', 'nord', 'ocean_dark', 'omni', 'one_dark_pro', 'onedark', 'outrun', 'panda', 'prussian', 'radical', 'react', 'rose', 'rose_pine', 'shades-of-purple', 'shadow_blue', 'shadow_green', 'shadow_red', 'slateorange', 'solarized-dark', 'solarized-light', 'swift', 'synthwave', 'tokyonight', 'transparent', 'vision-friendly-dark', 'vue', 'vue-dark', 'yeblu']
const layoutChartValue = ['compact', 'donut', 'donut-vertical', 'pie']

function convertListToEnum<T extends string>(arr: T[]): { [K in T]: K } {
  return Object.fromEntries(arr.map(key => [key, key])) as { [K in T]: K };
}


export const GithubTheme = convertListToEnum(themesValue)
export const GithubLayoutChart = convertListToEnum(layoutChartValue)
