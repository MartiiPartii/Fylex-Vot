package com.nefara.server.mapper.User;

import com.nefara.server.dto.User.UserDto;
import com.nefara.server.models.User;

public class UserMapper {
    public static UserDto mapToDto(User userForMapping) {
        if (userForMapping == null) return null;

        return new UserDto(
            userForMapping.getId(),
            userForMapping.getFirstName(),
            userForMapping.getLastName(),
            userForMapping.getEmail(),
            userForMapping.getProfileImage()
        );
    }
}
