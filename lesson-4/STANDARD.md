                                                                                                                                                                                                                                       
 | Code Type | Example | Casing Convention | Rationale |
| --- | --- | --- | --- |
| Components (Views) | HomeView.vue, UserProfile.vue | PascalCase (UpperCamelCase) | Used for classes and UI elements. This convention clearly distinguishes a component from a regular function. |
| Composables (Hooks) | useTaskManager.ts, useFetch.ts | camelCase (lowerCamelCase) | These are functions (hooks) that follow standard JavaScript function naming conventions. The use prefix is a strong convention indicating it's a composable. |
| Standard Functions | calculateTotal(items) | camelCase | Standard JavaScript function naming. |
| Variables/Props | isLoading, userName | camelCase | Standard JavaScript variable naming. |
| Constants | API_URL, MAX_ITEMS | SCREAMING_SNAKE_CASE | Standard JavaScript constant naming. |