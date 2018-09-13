#include <stdio.h>
#include "lua.h"
#include <lauxlib.h>
#include <lualib.h>
#include <dirent.h>

int run_lua(const char* script) {
	lua_State* lua = luaL_newstate();
	luaL_openlibs(lua);

	luaL_dostring(lua, script);

	size_t len = 0;
	const char* value = lua_tolstring(lua, lua_gettop(lua), &len);

	printf("%s\n", value);

	lua_close(lua);

	return 0;
}

int list_files(const char *path) {
    struct dirent *dp;
    DIR *dir = opendir(path);

    // Unable to open directory stream
    if (!dir) 
        return -1; 

    while ((dp = readdir(dir)) != NULL)
    {
        printf("%s\n", dp->d_name);
    }

    // Close directory stream
    closedir(dir);
    return 0;
}
